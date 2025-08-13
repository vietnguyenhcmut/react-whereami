import type { Plugin, ResolvedConfig } from "vite";
import path from "path";
import fs from "fs";

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

export function whereamiPlugin(): Plugin {
  let root: string;

  return {
    name: "react-whereami-vite-plugin",
    enforce: "pre",

    configResolved(resolvedConfig: ResolvedConfig) {
      root = resolvedConfig.root;
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/__whereami_get_source")) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const filePath = url.searchParams.get("path");
          if (filePath) {
            try {
              const fileContent = fs.readFileSync(filePath, "utf-8");
              res.setHeader("Content-Type", "text/plain; charset=utf-8");
              res.end(fileContent);
              return;
            } catch (error) {
              res.statusCode = 500;
              res.end(`Error reading file: ${filePath}`);
              return;
            }
          }
        }
        next();
      });
    },

    transform(code: string, id: string) {
      if (
        !id.includes("/src/") ||
        !/\.(tsx|jsx)$/.test(id) ||
        id.includes("node_modules")
      ) {
        return null;
      }

      const ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });

      traverse(ast, {
        JSXOpeningElement(nodePath: any) {
          const nodeName = nodePath.node.name;
          if (
            nodeName.type === "JSXIdentifier" &&
            /^[A-Z]/.test(nodeName.name)
          ) {
            const componentName = nodeName.name;
            const binding = nodePath.scope.getBinding(componentName);
            if (binding && binding.kind === "module") {
              const importDeclaration = binding.path.parentPath;
              if (importDeclaration?.isImportDeclaration()) {
                const importSource = importDeclaration.node.source.value;
                const dirName = path.dirname(id);
                const definitionFilePath = path.resolve(dirName, importSource);

                let finalDefinitionPath = definitionFilePath;
                if (!/\.(tsx|jsx)$/.test(finalDefinitionPath)) {
                  finalDefinitionPath = `${finalDefinitionPath}.tsx`;
                }

                const usageFilePath = path.relative(root, id);
                const usageLine = nodePath.node.loc.start.line;

                nodePath.node.attributes.push({
                  type: "JSXAttribute" as const,
                  name: {
                    type: "JSXIdentifier" as const,
                    name: "data-whereami-definition-file",
                  },
                  value: {
                    type: "StringLiteral" as const,
                    value: finalDefinitionPath,
                  },
                });
                nodePath.node.attributes.push({
                  type: "JSXAttribute" as const,
                  name: {
                    type: "JSXIdentifier" as const,
                    name: "data-whereami-usage-file",
                  },
                  value: {
                    type: "StringLiteral" as const,
                    value: usageFilePath,
                  },
                });
                nodePath.node.attributes.push({
                  type: "JSXAttribute" as const,
                  name: {
                    type: "JSXIdentifier" as const,
                    name: "data-whereami-usage-line",
                  },
                  value: {
                    type: "StringLiteral" as const,
                    value: String(usageLine),
                  },
                });
                nodePath.node.attributes.push({
                  type: "JSXAttribute" as const,
                  name: {
                    type: "JSXIdentifier" as const,
                    name: "data-whereami-usage-absolute-file",
                  },
                  value: { type: "StringLiteral" as const, value: id },
                });
              }
            }
          }
        },
      });
      const output = generate(ast, {}, code);
      return { code: output.code, map: null };
    },
  };
}
