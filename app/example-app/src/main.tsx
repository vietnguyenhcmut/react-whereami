import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RWInspector } from "@vietnguyenhcmut/react-whereami-runtime";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {import.meta.env.DEV && <RWInspector />}
  </StrictMode>
);
