# react-whereami ⚛️

Stop guessing where your React components live. react-whereami is a dev-only tool that instantly shows you the source code of any component right in your browser.

Instead of hunting through your codebase to find where a piece of the UI is rendered, just hover over it and get a direct link to the code.
<img width="669" height="510" alt="image" src="https://github.com/user-attachments/assets/fb2f3e0e-822e-452b-83dd-3f0a9f08517b" />

# Why react-whereami?

In large codebases, finding the exact source file for a UI element can be a tedious task. react-whereami solves this by providing instant context, directly in the browser, dramatically speeding up your development workflow.

# Features ✨

- Live Source Inspection: Hover over any component on the page to see its original source code.

- Dual-Context Info: See both the component's definition file (e.g., Button.tsx) and exactly where it's being used (e.g., App.tsx:10).

- Click-to-Open in VS Code: Click on the usage path to open the file directly in your IDE at the correct line.

- Pin Tooltip: Pin the tooltip to keep it open for a closer look. No more disappearing tooltips!

- Syntax Highlighting: Code is displayed with a familiar, VSCode-like theme.

- Toggle On/Off: Activate the inspector only when you need it with a simple hotkey.

- Production-Safe: It's a dev-only tool and adds zero bloat to your production build.

# Installation

The library includes two packages: a plugin and a runtime component.

- Using pnpm (recommended):

```
pnpm add -D @vietnguyenhcmut/react-whereami-plugin @vietnguyenhcmut/react-whereami-runtime
```

- Using yarn:

```
yarn add -D @vietnguyenhcmut/react-whereami-plugin @vietnguyenhcmut/react-whereami-runtime
```

- Using npm:

```
npm install -D @vietnguyenhcmut/react-whereami-plugin @vietnguyenhcmut/react-whereami-runtime
```

# Usage

### 1. Configure the Plugin

Open your `vite.config.ts` and add the `whereamiPlugin`. Important: The plugin must be placed before `@vitejs/plugin-react`.

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { whereamiPlugin } from "@vietnguyenhcmut/react-whereami-plugin";

export default defineConfig(({ mode }) => {
  console.log(`[vite.config.ts] Running in mode: "${mode}"`);

  return {
    plugins: [...(mode === "development" ? [whereamiPlugin()] : []), react()],
  };
});
```

### 2. Add the Inspector to Your App

In your app's entry point (usually `src/main.tsx`), render the `<Inspector />` component and import its theme CSS.

```typescript
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { Inspector } from "@vietnguyenhcmut/react-whereami-runtime";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    {/_ The Inspector will only render in development mode _/}
    {import.meta.env.DEV && <Inspector />}
  </React.StrictMode>
);
```

### 3. How to Activate

The inspector is off by default. To toggle it on or off, press:

```
Shift + I
```

A small status indicator will appear at the bottom-right corner of the screen to let you know if the inspector is active.

# How It Works

`react-whereami` combines a build-time plugin with a runtime component:

### The Plugin (@vietnguyenhcmut/react-whereami-plugin):

This runs in Node.js during development. It uses Babel to parse your code's Abstract Syntax Tree (AST). When it finds a custom component like `<Button>`, it figures out where that component was defined (e.g., Button.tsx) and where it was used (e.g., App.tsx:10). It then injects this information as `data-whereami-\*` attributes right into the JSX. It also creates a special API endpoint to serve original source files on request.

### The Runtime Component (@vietnguyenhcmut/react-whereami-runtime):

The `<Inspector />` component renders only in your browser during development. It listens for the activation hotkey (`Shift + I`). When active, it listens for mouse hover events across the page. When you hover over an element that has our special `data-whereami-\*` attributes, it reads them, fetches the original source code from the plugin's API endpoint, and renders the helpful tooltip with syntax-highlighted code.
