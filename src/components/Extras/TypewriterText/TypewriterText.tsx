import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { TypewriterTextProps } from "./types";
import "./TypewriterText.css";

/**
 * TypewriterText — renders text with a Copilot-style typewriter animation.
 *
 * Three modes:
 * - "typewriter" (default): animates from empty → full text on every `text` change.
 * - "stream": only animates newly appended characters; designed for live token streams.
 * - "instant": no animation; renders text immediately.
 *
 * Cursor states:
 * - `thinking`: blinking block cursor, no text yet.
 * - Actively typing: solid cursor at the trailing edge of the text.
 * - Waiting (stream mode, `streaming=true`): blinking cursor after catching up.
 * - Done: cursor fades out.
 */
export function TypewriterText({
  text = "",
  mode = "typewriter",
  speed = 40,
  cursor = true,
  cursorChar = "▋",
  thinking = false,
  streaming = false,
  delay = 0,
  onComplete,
  as: Tag = "span",
  className,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState<string>(mode === "instant" ? text : "");
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(mode === "instant");
  const [exiting, setExiting] = useState(false);

  // Tracks how many characters were already animated in stream mode
  const streamPosRef = useRef(0);

  // Stable refs for callbacks and the latest text (avoid stale closures inside timers)
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const latestTextRef = useRef(text);
  latestTextRef.current = text;

  // ── Typewriter mode ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "typewriter") return;

    setDisplayed("");
    setDone(false);
    setExiting(false);
    setAnimating(false);

    if (!text) {
      setDone(true);
      return;
    }

    const msPerChar = Math.max(10, 1000 / speed);
    let pos = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const startTyping = () => {
      setAnimating(true);
      intervalId = setInterval(() => {
        const target = latestTextRef.current;
        pos++;
        setDisplayed(target.slice(0, pos));
        if (pos >= target.length) {
          clearInterval(intervalId);
          setAnimating(false);
          setDone(true);
          onCompleteRef.current?.();
        }
      }, msPerChar);
    };

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (delay > 0) {
      timeoutId = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
    // Intentionally only on text + mode. speed/delay changes mid-animation are ignored.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mode]);

  // ── Stream mode ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "stream") return;

    // Text was reset to empty → full reset
    if (text.length === 0) {
      streamPosRef.current = 0;
      setDisplayed("");
      setAnimating(false);
      setDone(false);
      setExiting(false);
      return;
    }

    // Nothing new to animate yet
    if (text.length <= streamPosRef.current) return;

    const msPerChar = Math.max(10, 1000 / speed);
    let pos = streamPosRef.current;
    setAnimating(true);
    setDone(false);
    setExiting(false);

    const intervalId = setInterval(() => {
      pos++;
      streamPosRef.current = pos;
      setDisplayed(latestTextRef.current.slice(0, pos));
      if (pos >= latestTextRef.current.length) {
        clearInterval(intervalId);
        setAnimating(false);
        onCompleteRef.current?.();
      }
    }, msPerChar);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mode]);

  // ── Instant mode ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "instant") return;
    setDisplayed(text);
    setAnimating(false);
    setDone(true);
  }, [text, mode]);

  // ── Cursor exit animation trigger ────────────────────────────────────────────
  // Kick off the fade-out once streaming is really complete and animation settled.
  const prevStreamingRef = useRef(streaming);
  useEffect(() => {
    const wasStreaming = prevStreamingRef.current;
    prevStreamingRef.current = streaming;
    if (wasStreaming && !streaming && !animating && mode === "stream") {
      setExiting(true);
      const t = setTimeout(() => {
        setExiting(false);
        setDone(true);
      }, 650);
      return () => clearTimeout(t);
    }
  }, [streaming, animating, mode]);

  // ── Cursor visibility logic ──────────────────────────────────────────────────
  // thinking → blinking (overrides everything)
  // animating → solid
  // stream mode, streaming=true, caught up → blinking (more data expected)
  // exiting → fading out
  // done → hidden
  const showCursor =
    cursor &&
    (thinking ||
      animating ||
      exiting ||
      (mode === "stream" && streaming && !done) ||
      (mode === "typewriter" && !done));

  const cursorClass = thinking
    ? "tw-cursor--blink"
    : animating
      ? "tw-cursor--solid"
      : exiting
        ? "tw-cursor--out"
        : "tw-cursor--blink"; // streaming, waiting for more

  const Element = Tag as React.ElementType;

  return (
    <Element className={cn(className)}>
      {/* Zero-width space keeps line-height correct when only cursor is shown */}
      {thinking && !displayed && <span aria-hidden="true">&#8203;</span>}
      {displayed}
      {showCursor && (
        <span className={cn("tw-cursor", cursorClass)} aria-hidden="true">
          {cursorChar}
        </span>
      )}
    </Element>
  );
}
