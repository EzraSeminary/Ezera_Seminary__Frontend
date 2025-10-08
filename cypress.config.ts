import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      config.baseUrl =
        process.env.CYPRESS_BASE_URL ||
        config.env.baseUrl ||
        "http://localhost:5173";
    },

    defaultCommandTimeout: 20000,
    pageLoadTimeout: 20000,
    requestTimeout: 20000,
  },
});
