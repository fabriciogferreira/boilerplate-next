import { defineConfig } from "vitest/config";

// Playwright specs also use .spec.ts. Collect only unit tests under src.
export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
