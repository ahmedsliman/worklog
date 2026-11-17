const { defineConfig } = require("../e2e/node_modules/@playwright/test");

module.exports = defineConfig({
    testDir: "./tests",
    use: { baseURL: process.env.DEMO_URL || "http://127.0.0.1:4174", launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } },
});
