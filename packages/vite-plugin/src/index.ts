import type { Plugin, ResolvedConfig } from "vite";
import { configureDevServer } from "./server/middleware";
import { transformCode } from "./core/transformer";

export function whereamiPlugin(): Plugin {
  let root: string;

  return {
    name: "react-whereami-plugin",
    enforce: "pre",

    configResolved(resolvedConfig: ResolvedConfig) {
      root = resolvedConfig.root;
    },

    configureServer(server) {
      configureDevServer(server);
    },

    transform(code: string, id: string) {
      if (
        !id.includes("/src/") ||
        !/\.(tsx|jsx)$/.test(id) ||
        id.includes("node_modules")
      ) {
        return null;
      }
      return transformCode(code, id, root);
    },
  };
}
