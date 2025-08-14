import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["packages/plugin/src/index.ts"],
    outDir: "packages/plugin/dist",
    tsconfig: "packages/plugin/tsconfig.json",
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
  },
  {
    entry: ["packages/runtime/src/index.ts"],
    outDir: "packages/runtime/dist",
    tsconfig: "packages/runtime/tsconfig.json",
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "highlight.js"],
  },
]);
