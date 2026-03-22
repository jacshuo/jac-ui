/**
 * Build CSS — produces:
 *   dist/styles.css                         Full pre-compiled bundle (Tailwind + all tokens + all component CSS)
 *   dist/styles/base.css                    Tailwind + core tokens (no component-specific extras)
 *   dist/styles/tokens.css                  Raw theme tokens & keyframes (for own-Tailwind consumers)
 *   dist/styles/tailwind.css                Tailwind v4 integration (@source + tokens, for own-Tailwind consumers)
 *   dist/styles/<Category>/<Component>.css  Per-component CSS for tree-shakeable imports
 */
import { execSync } from "node:child_process";
import {
  mkdirSync,
  copyFileSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import postcssImport from "postcss-import";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: root });
const postcssCli = resolve(root, "node_modules/.bin/postcss");

mkdirSync(resolve(root, "dist/styles"), { recursive: true });
mkdirSync(resolve(root, "dist/styles/tokens"), { recursive: true });

// 1. Full bundle (PostCSS-processed: Tailwind + everything)
run(`"${postcssCli}" src/styles/index.css -o dist/styles.css --no-map`);

// 2. Base bundle (PostCSS-processed: Tailwind + core tokens, no extras)
run(`"${postcssCli}" src/styles/base.css -o dist/styles/base.css --no-map`);

// 3. Raw tokens (for consumers who have their own Tailwind setup)
copyFileSync(resolve(root, "src/styles/tokens.css"), resolve(root, "dist/styles/tokens.css"));
copyFileSync(
  resolve(root, "src/styles/tokens/core.css"),
  resolve(root, "dist/styles/tokens/core.css"),
);
copyFileSync(
  resolve(root, "src/styles/tokens/animations-shared.css"),
  resolve(root, "dist/styles/tokens/animations-shared.css"),
);

// 3b. Tailwind integration file (for own-Tailwind consumers — @source + tokens)
copyFileSync(resolve(root, "src/styles/tailwind.css"), resolve(root, "dist/styles/tailwind.css"));

// 4. Hierarchical per-component CSS: dist/styles/<Category>/<Component>.css
//    Uses postcss-import to inline any @import statements so the output files
//    are fully self-contained and work in any consumer's build pipeline.
const componentsRoot = resolve(root, "src/components");
for (const category of readdirSync(componentsRoot)) {
  const categoryPath = resolve(componentsRoot, category);
  if (!statSync(categoryPath).isDirectory()) continue;

  const distCategoryPath = resolve(root, "dist/styles", category);
  mkdirSync(distCategoryPath, { recursive: true });

  for (const maybeComponent of readdirSync(categoryPath)) {
    const componentPath = resolve(categoryPath, maybeComponent);
    if (!statSync(componentPath).isDirectory()) continue;

    const cssFile = resolve(componentPath, `${maybeComponent}.css`);
    try {
      if (!statSync(cssFile).isFile()) continue;
    } catch {
      // Component has no colocated CSS file — skip.
      continue;
    }

    const src = readFileSync(cssFile, "utf8");
    const hasImport = src.includes("@import");

    if (hasImport) {
      // Resolve and inline all @import statements so the output is self-contained.
      const result = await postcss([postcssImport()]).process(src, {
        from: cssFile,
        map: false,
      });
      writeFileSync(resolve(distCategoryPath, `${maybeComponent}.css`), result.css);
    } else {
      copyFileSync(cssFile, resolve(distCategoryPath, `${maybeComponent}.css`));
    }
  }
}

console.log("✓ CSS build complete");
