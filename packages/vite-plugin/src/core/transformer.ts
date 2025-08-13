import path from "path";
import * as t from "@babel/types";
import { INTERNAL_COMPONENTS } from "../utils/constants";

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

export function transformCode(code: string, id: string, root: string) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  traverse(ast, {
    JSXElement(nodePath: any) {
      const parent = nodePath.parent;
      if (
        parent.type === "JSXElement" &&
        parent.openingElement.attributes.some(
          (attr: any) => attr.name && attr.name.name === "data-whereami-wrapper"
        )
      ) {
        return;
      }

      const openingElement = nodePath.node.openingElement;
      const nodeName = openingElement.name;

      if (nodeName.type === "JSXIdentifier" && /^[A-Z]/.test(nodeName.name)) {
        const componentName = nodeName.name;

        if (INTERNAL_COMPONENTS.has(componentName)) {
          return;
        }

        const binding = nodePath.scope.getBinding(componentName);

        if (binding && binding.kind === "module") {
          const importDeclaration = binding.path.parentPath;
          if (importDeclaration?.isImportDeclaration()) {
            const importSource = importDeclaration.node.source.value;

            if (importSource === "react" || importSource === "react-dom") {
              return;
            }

            const dirName = path.dirname(id);
            const definitionFilePath = path.resolve(dirName, importSource);

            let finalDefinitionPath = definitionFilePath;
            if (!/\.(tsx|jsx)$/.test(finalDefinitionPath)) {
              finalDefinitionPath = `${finalDefinitionPath}.tsx`;
            }

            const relativeDefinitionPath = path.relative(
              root,
              finalDefinitionPath
            );
            const usageFilePath = path.relative(root, id);
            const usageLine = nodePath.node.loc.start.line;
            const usageAbsoluteFile = id;

            const wrapperIdAttr = t.jsxAttribute(
              t.jsxIdentifier("data-whereami-wrapper"),
              t.stringLiteral("true")
            );
            const styleAttr = t.jsxAttribute(
              t.jsxIdentifier("style"),
              t.jsxExpressionContainer(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier("display"),
                    t.stringLiteral("contents")
                  ),
                ])
              )
            );

            const definitionFileAttr = t.jsxAttribute(
              t.jsxIdentifier("data-whereami-definition-file"),
              t.stringLiteral(relativeDefinitionPath)
            );
            const definitionAbsoluteFileAttr = t.jsxAttribute(
              t.jsxIdentifier("data-whereami-definition-absolute-file"),
              t.stringLiteral(finalDefinitionPath)
            );
            const usageFileAttr = t.jsxAttribute(
              t.jsxIdentifier("data-whereami-usage-file"),
              t.stringLiteral(usageFilePath)
            );
            const usageLineAttr = t.jsxAttribute(
              t.jsxIdentifier("data-whereami-usage-line"),
              t.stringLiteral(String(usageLine))
            );
            const usageAbsoluteFileAttr = t.jsxAttribute(
              t.jsxIdentifier("data-whereami-usage-absolute-file"),
              t.stringLiteral(usageAbsoluteFile)
            );

            const wrapperOpeningElement = t.jsxOpeningElement(
              t.jsxIdentifier("div"),
              [
                wrapperIdAttr,
                styleAttr,
                definitionFileAttr,
                definitionAbsoluteFileAttr,
                usageFileAttr,
                usageLineAttr,
                usageAbsoluteFileAttr,
              ]
            );
            const wrapperClosingElement = t.jsxClosingElement(
              t.jsxIdentifier("div")
            );

            const wrapperElement = t.jsxElement(
              wrapperOpeningElement,
              wrapperClosingElement,
              [t.cloneNode(nodePath.node)],
              false
            );

            nodePath.replaceWith(wrapperElement);
          }
        }
      }
    },
  });
  const output = generate(ast, {}, code);
  return { code: output.code, map: null };
}
