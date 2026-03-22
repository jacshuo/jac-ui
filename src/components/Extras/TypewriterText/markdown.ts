import { Marked, type Tokens } from "marked";
import katex from "katex";

/* ── ImageOff SVG (matches lucide-react image-off icon) ──────────────────── */
const IMAGE_OFF_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"` +
  ` fill="none" stroke="currentColor" stroke-width="2"` +
  ` stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
  `<line x1="2" y1="2" x2="22" y2="22"/>` +
  `<path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/>` +
  `<line x1="13.5" y1="6" x2="18" y2="6"/>` +
  `<line x1="6" y1="2" x2="14" y2="10"/>` +
  `<path d="M4 6h1.5"/>` +
  `<path d="M2 18.5C2 19.9 3.1 21 4.5 21H16"/>` +
  `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>` +
  `</svg>`;

/* ── Attribute/text escaping ─────────────────────────────────────────────── */
function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ── Allowlist-based HTML sanitiser ──────────────────────────────────────────
 * Strips <script>, <style>, on* event handlers, and dangerous URI schemes.
 * No external sanitiser library required.
 */
function sanitizeHtml(html: string): string {
  return (
    html
      // Strip <script>…</script> (including all content)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Strip <style>…</style>
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      // Strip all on* event handlers (onclick, onerror, onload, …)
      .replace(/\s+on[a-z][a-z0-9]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s/>]*)/gi, "")
      // Replace javascript:/vbscript: URI schemes in attribute values
      .replace(/\b(href|src|action)\s*=\s*["']\s*(?:javascript|vbscript)\s*:[^"'>]*/gi, '$1="#"')
      // Replace data: hrefs (SVG/HTML payload vector)
      .replace(/\bhref\s*=\s*["']\s*data\s*:[^"'>]*/gi, 'href="#"')
  );
}

/* ── Local Marked instance with custom image renderer ───────────────────── */
// A local instance is used to avoid modifying the global `marked` singleton.
const localMarked = new Marked();

localMarked.use({
  renderer: {
    // Override image rendering: wrap in a figure with an error-state slot.
    image({ href, title, text }: Tokens.Image): string {
      // Only allow http/https sources to block data:/javascript: image XSS.
      const safeSrc = /^https?:\/\//i.test(href ?? "") ? href : "";
      const altAttr = text ? ` alt="${escapeAttr(text)}"` : ' alt=""';
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
      const errorLabel = escapeAttr(text || "Image failed to load");
      return (
        `<figure class="tw-rich-img-wrap">` +
        `<img class="tw-rich-img" src="${escapeAttr(safeSrc)}" loading="lazy"${altAttr}${titleAttr} />` +
        `<div class="tw-rich-img-error">` +
        IMAGE_OFF_SVG +
        `<span>${errorLabel}</span>` +
        `</div>` +
        `</figure>`
      );
    },
  },
});

/**
 * Parse Markdown to sanitised HTML, safe for use with `dangerouslySetInnerHTML`.
 *
 * - Uses a local `Marked` instance (does not touch the global singleton).
 * - LaTeX math expressions are extracted BEFORE Marked parses (so Marked never
 *   sees `_` or `\` inside math), then restored as KaTeX HTML afterwards.
 * - Images are wrapped in a `<figure>` with a hidden error-state overlay.
 * - The output is sanitised with a lightweight allowlist approach.
 *
 * Streaming safety: only COMPLETE (closed) LaTeX expressions are extracted and
 * rendered. Incomplete expressions during streaming pass through as raw text
 * and are rendered naturally once the closing delimiter arrives.
 */
export function renderMarkdown(text: string): string {
  // 1. Extract LaTeX before Marked sees it (protects math from Markdown processing)
  const { result: protected_, store } = extractLatex(text);
  // 2. Parse Markdown
  const html = localMarked.parse(protected_, { async: false }) as string;
  // 3. Sanitize Marked's HTML output
  const sanitized = sanitizeHtml(html);
  // 4. Restore LaTeX as KaTeX-rendered HTML (KaTeX output is intrinsically safe)
  return restoreLatex(sanitized, store);
}

/* ── LaTeX extraction → KaTeX rendering ─────────────────────────────────── */

interface LatexEntry {
  src: string;
  display: boolean;
}

/**
 * Extracts complete LaTeX math expressions and replaces them with HTML-comment
 * placeholders that Marked passes through verbatim.
 *
 * Supported delimiters (block first, then inline):
 *   $$...$$      \[...\]   — display / block math
 *   \(...\)      $...$     — inline math
 */
function extractLatex(text: string): { result: string; store: LatexEntry[] } {
  const store: LatexEntry[] = [];
  const result = text
    // Display math: $$...$$ (must check before single $)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, src) => {
      const i = store.push({ src, display: true }) - 1;
      return `<!--LATEX_${i}-->`;
    })
    // Display math: \[...\]
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, src) => {
      const i = store.push({ src, display: true }) - 1;
      return `<!--LATEX_${i}-->`;
    })
    // Inline math: \(...\)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, src) => {
      const i = store.push({ src, display: false }) - 1;
      return `<!--LATEX_${i}-->`;
    })
    // Inline math: $...$ (no newlines inside; avoid matching $$)
    .replace(/(?<!\$)\$(?!\$)((?:[^\n$\\]|\\[^\n])+?)\$(?!\$)/g, (_, src) => {
      const i = store.push({ src, display: false }) - 1;
      return `<!--LATEX_${i}-->`;
    });
  return { result, store };
}

/**
 * Replaces HTML-comment placeholders with KaTeX-rendered HTML.
 * Falls back to monospace raw LaTeX if KaTeX throws.
 */
function restoreLatex(html: string, store: LatexEntry[]): string {
  if (store.length === 0) return html;
  return html.replace(/<!--LATEX_(\d+)-->/g, (match, idx) => {
    const entry = store[Number(idx)];
    if (!entry) return match;
    try {
      return katex.renderToString(entry.src, {
        displayMode: entry.display,
        throwOnError: false,
        output: "html",
        trust: false,
      });
    } catch {
      return entry.display
        ? `<span class="tw-latex-raw">\\[${entry.src}\\]</span>`
        : `<code class="tw-latex-raw">$${entry.src}$</code>`;
    }
  });
}
