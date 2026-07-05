import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "text", "html"],
      include: ["src/**"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        "src/lib/data/**", // static mock/sentinel data — no logic to test
        "src/lib/types.ts", // type-only
        "src/lib/site.ts", // static config constants
        "src/app/**/layout.tsx", // framework wiring
        "src/app/**/opengraph-image.tsx",
        "src/app/**/error.tsx",
        "src/app/not-found.tsx",
        "src/app/sitemap.ts",
        "src/app/robots.ts",
      ],
      thresholds: {
        // Global floor — a ratchet that rises toward 85% as component tests
        // land (see TEST-PLAN.md). Kept just below current so the build stays
        // green while blocking regressions.
        statements: 34,
        branches: 30,
        functions: 27,
        lines: 34,
        // Critical layers are fully tested and must stay that way.
        "src/lib/**": { statements: 100, branches: 100, functions: 100, lines: 100 },
        "src/app/api/**": { statements: 100, branches: 100, functions: 100, lines: 100 },
        "src/middleware.ts": { statements: 100, branches: 100, functions: 100, lines: 100 },
      },
    },
  },
});
