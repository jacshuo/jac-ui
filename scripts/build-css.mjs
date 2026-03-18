/**
 * Build CSS — produces:
 *   dist/styles.css                    Full pre-compiled bundle (Tailwind + all tokens + all animations)
 *   dist/styles/base.css               Tailwind + core tokens (no component-specific extras)
 *   dist/styles/tokens.css             Raw theme tokens & core keyframes (for own-Tailwind consumers)
 *   dist/styles/CinePlayer.css         CinePlayer keyframes + design tokens
 *   dist/styles/MiniPlayer.css         MiniPlayer keyframes + design tokens
 *   dist/styles/FileExplorer.css       FileExplorer design tokens
 *   dist/styles/FilmReel.css           FilmReel keyframes
 */
import { execSync } from "node:child_process";
import { mkdirSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: root });
const postcss = resolve(root, "node_modules/.bin/postcss");

mkdirSync(resolve(root, "dist/styles"), { recursive: true });

// 1. Full bundle (PostCSS-processed: Tailwind + everything)
run(`"${postcss}" src/styles/index.css -o dist/styles.css --no-map`);

// 2. Base bundle (PostCSS-processed: Tailwind + core tokens, no extras)
run(`"${postcss}" src/styles/base.css -o dist/styles/base.css --no-map`);

// 3. Raw tokens (for consumers who have their own Tailwind setup)
copyFileSync(resolve(root, "src/styles/tokens.css"), resolve(root, "dist/styles/tokens.css"));

// 4. Per-component CSS (pure CSS — no Tailwind processing needed)
const extras = ["CinePlayer", "MiniPlayer", "FileExplorer", "FilmReel"];
for (const name of extras) {
  copyFileSync(
    resolve(root, `src/styles/components/${name}.css`),
    resolve(root, `dist/styles/${name}.css`),
  );
}

console.log("✓ CSS build complete");
