export interface TypewriterTextProps {
  /** Full text content to display. */
  text: string;
  /**
   * Animation mode.
   * - `"typewriter"` (default): animates from empty → full text whenever `text` changes.
   * - `"stream"`: only animates newly appended characters; ideal for LLM token streams.
   * - `"instant"`: no animation — renders text immediately.
   */
  mode?: "typewriter" | "stream" | "instant";
  /** Typing speed in characters per second. @default 40 */
  speed?: number;
  /** Show a cursor at the end of the text. @default true */
  cursor?: boolean;
  /** Cursor glyph. @default "▋" */
  cursorChar?: string;
  /**
   * When `true`, renders only a blinking cursor (no text) — the "model is thinking"
   * state before the first token arrives.
   */
  thinking?: boolean;
  /**
   * Pass `true` while the parent is still receiving streaming data.
   * Keeps the cursor visible and blinking even after the component has caught up
   * to the current `text` value.
   * Pass `false` (or omit) once the stream is complete.
   */
  streaming?: boolean;
  /** Delay in ms before the animation begins (typewriter mode only). @default 0 */
  delay?: number;
  /** Called once each time the current animation sequence finishes catching up. */
  onComplete?: () => void;
  /** HTML element to render as. @default "span" */
  as?:
    | "span"
    | "div"
    | "p"
    | "pre"
    | "code"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "label"
    | "li";
  className?: string;
}
