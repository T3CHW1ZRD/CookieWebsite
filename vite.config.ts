import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy to a GitHub project page (username.github.io/REPO_NAME/),
// set BASE_PATH to "/REPO_NAME/". For a custom domain or username.github.io
// root site, leave it as "/".
const BASE_PATH = "/CookieWebsite/";

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH,
});
