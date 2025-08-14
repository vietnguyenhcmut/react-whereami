import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { whereamiPlugin } from "@vietnguyenhcmut/react-whereami-plugin";

export default defineConfig(({ mode }) => {
  console.log(`[vite.config.ts] Running in mode: "${mode}"`);

  return {
    plugins: [...(mode === "development" ? [whereamiPlugin()] : []), react()],
  };
});
