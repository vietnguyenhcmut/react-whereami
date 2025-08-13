import fs from "fs";
import type { ViteDevServer } from "vite";

export function configureDevServer(server: ViteDevServer) {
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
}
