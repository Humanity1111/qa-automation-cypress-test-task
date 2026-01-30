import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://demo.app.stack-it.ru',
    pageLoadTimeout: 120000, // 120 секунд
    defaultCommandTimeout: 15000
  }
});
