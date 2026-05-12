import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    env: {
      // Match the production build: admin enabled and pointed at a fake repo.
      VITE_ENABLE_ADMIN: "true",
      VITE_GH_OWNER: "TestOwner",
      VITE_GH_REPO: "TestRepo",
      VITE_GH_BRANCH: "main",
    },
  },
});
