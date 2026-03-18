import { readdirSync } from "fs";
import { defineConfig } from "tsup";

// Auto-discover all .tsx components — no manual list needed
const componentEntries = Object.fromEntries(
  readdirSync("src/components")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => [f.replace(".tsx", ""), `src/components/${f}`]),
);

export default defineConfig({
  entry: {
    index: "src/index.ts",
    ...componentEntries,
    utils: "src/lib/utils.ts",
    theme: "src/styles/theme.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  treeshake: true,
  minify: true,
  sourcemap: false,
  external: [
    "react",
    "react-dom",
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "tailwind-merge",
  ],
  outDir: "dist",
  clean: true,
  target: "es2020",
  jsx: "automatic",
  esbuildOptions(options) {
    options.chunkNames = "chunks/[name]-[hash]";
  },
});
