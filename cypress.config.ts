import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
    setupNodeEvents(on, config) {
      // You can add node event handlers here if needed
    },

    defaultCommandTimeout: 20000,
    pageLoadTimeout: 20000,
    requestTimeout: 20000,
  },
});
