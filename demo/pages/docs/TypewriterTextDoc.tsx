import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const typewriterTextProps: PropRow[] = [
  {
    prop: "text",
    type: "string",
    required: true,
    description: "Full text content to display.",
  },
  {
    prop: "mode",
    type: `"typewriter" | "stream" | "instant"`,
    default: `"typewriter"`,
    description:
      "Animation mode. typewriter replays full text on each change; stream appends only new chars; instant renders immediately.",
  },
  {
    prop: "speed",
    type: "number",
    default: "40",
    description: "Typing speed in characters per second.",
  },
  {
    prop: "cursor",
    type: "boolean",
    default: "true",
    description: "Show a cursor glyph at the trailing edge of the text.",
  },
  {
    prop: "cursorChar",
    type: "string",
    default: `"▋"`,
    description: "The glyph to use as the cursor.",
  },
  {
    prop: "thinking",
    type: "boolean",
    description:
      'When true, renders only a blinking cursor with no text — the "model is thinking" state before the first token arrives.',
  },
  {
    prop: "streaming",
    type: "boolean",
    description:
      "Pass true while the parent is still receiving data. Keeps the cursor blinking even after the component has fully caught up to the current text value. Pass false (or omit) once the stream is complete.",
  },
  {
    prop: "delay",
    type: "number",
    default: "0",
    description: "Delay in milliseconds before the animation starts (typewriter mode only).",
  },
  {
    prop: "onComplete",
    type: "() => void",
    description: "Called once each time the current animation sequence finishes catching up.",
  },
  {
    prop: "as",
    type: `"span" | "div" | "p" | "pre" | "code" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "li"`,
    default: `"span"`,
    description: "HTML element to render as — the component is fully polymorphic.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes to merge onto the root element.",
  },
];

const typewriterCode = `import { TypewriterText } from "@jacshuo/onyx";

// Replays full text animation every time \`text\` changes
export function Example() {
  return (
    <TypewriterText
      text="Hello, world!"
      speed={40}
      as="p"
      className="text-lg"
    />
  );
}`;

const streamCode = `import { useState, useEffect } from "react";
import { TypewriterText } from "@jacshuo/onyx";

const TOKENS = ["Hello", ", ", "world", "! ", "This", " is", " streaming", "."];

export function StreamExample() {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [thinking, setThinking] = useState(false);

  function start() {
    setText("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setStreaming(true);
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setText((prev) => prev + TOKENS[i - 1]);
        if (i >= TOKENS.length) {
          clearInterval(iv);
          setStreaming(false);
        }
      }, 300);
    }, 1500);
  }

  return (
    <div>
      <button onClick={start}>Start stream</button>
      <TypewriterText
        text={text}
        mode="stream"
        streaming={streaming}
        thinking={thinking}
        speed={60}
        as="p"
      />
    </div>
  );
}`;

const instantCode = `import { TypewriterText } from "@jacshuo/onyx";

// No animation — renders immediately
export function InstantExample() {
  return (
    <TypewriterText
      text="Displayed immediately with no cursor"
      mode="instant"
      cursor={false}
      as="p"
    />
  );
}`;

const cursorCode = `import { TypewriterText } from "@jacshuo/onyx";

// Custom cursor glyph
export function CursorExample() {
  return (
    <>
      <TypewriterText text="Block cursor" cursorChar="▋" as="p" />
      <TypewriterText text="Line cursor" cursorChar="|" as="p" />
      <TypewriterText text="Underscore cursor" cursorChar="_" as="p" />
      <TypewriterText text="No cursor" cursor={false} as="p" />
    </>
  );
}`;

const polymorphicCode = `import { TypewriterText } from "@jacshuo/onyx";

// Render as any HTML element
export function PolymorphicExample() {
  return (
    <article>
      <TypewriterText text="Section title" as="h2" className="text-2xl font-bold" />
      <TypewriterText text="Body paragraph." as="p" delay={800} />
      <ul>
        <TypewriterText text="First item" as="li" delay={1600} />
      </ul>
    </article>
  );
}`;

const typesCode = `export interface TypewriterTextProps {
  text: string;
  mode?: "typewriter" | "stream" | "instant";
  speed?: number;
  cursor?: boolean;
  cursorChar?: string;
  thinking?: boolean;
  streaming?: boolean;
  delay?: number;
  onComplete?: () => void;
  as?: "span" | "div" | "p" | "pre" | "code"
     | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
     | "label" | "li";
  className?: string;
}`;

export default function TypewriterTextDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>TypewriterText</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { TypewriterText, type TypewriterTextProps } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Props">
        <PropTable rows={typewriterTextProps} title="TypewriterText" />
      </Section>

      <Section title="Typewriter Mode (default)">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Animates from empty to the full <code>text</code> value every time <code>text</code>{" "}
          changes. Ideal for static content or phrase-cycling carousels.
        </p>
        <CodeExample code={typewriterCode} />
      </Section>

      <Section title="Stream Mode">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Append-only mode designed for live LLM token streams. Only newly added characters are
          animated — existing characters are never re-rendered. Pass{" "}
          <code>thinking=&#123;true&#125;</code> while waiting for the first token,{" "}
          <code>streaming=&#123;true&#125;</code> while data is still arriving, and flip{" "}
          <code>streaming</code> to <code>false</code> when the stream ends.
        </p>
        <CodeExample code={streamCode} />
      </Section>

      <Section title="Instant Mode">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          No animation — renders text immediately. Useful for server-rendered content or when the
          user has a prefers-reduced-motion preference.
        </p>
        <CodeExample code={instantCode} />
      </Section>

      <Section title="Custom Cursor">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Any single character can be used as the cursor glyph via <code>cursorChar</code>. Disable
          the cursor entirely with <code>cursor=&#123;false&#125;</code>.
        </p>
        <CodeExample code={cursorCode} />
      </Section>

      <Section title="Polymorphic Rendering">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Use the <code>as</code> prop to control the rendered HTML element. The component is fully
          polymorphic and works with headings, paragraphs, list items, and more.
        </p>
        <CodeExample code={polymorphicCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
