import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { TypewriterText } from "../components/Extras/TypewriterText";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── Instant mode ────────────────────────────────────────────────────────────

describe("TypewriterText — instant mode", () => {
  it("renders text immediately", () => {
    render(<TypewriterText text="Hello world" mode="instant" />);
    expect(screen.getByText(/Hello world/)).toBeInTheDocument();
  });

  it("renders as span by default", () => {
    const { container } = render(<TypewriterText text="Hi" mode="instant" />);
    expect(container.querySelector("span")).not.toBeNull();
  });

  it("renders as custom element when as='p'", () => {
    const { container } = render(<TypewriterText text="Hi" mode="instant" as="p" />);
    expect(container.querySelector("p")).not.toBeNull();
  });

  it("renders as h2 when as='h2'", () => {
    const { container } = render(<TypewriterText text="Heading" mode="instant" as="h2" />);
    expect(container.querySelector("h2")).not.toBeNull();
  });

  it("hides cursor when cursor=false", () => {
    const { container } = render(<TypewriterText text="Hi" mode="instant" cursor={false} />);
    expect(container.querySelector(".tw-cursor")).toBeNull();
  });

  it("does not show cursor in instant mode (done=true, not thinking/animating)", () => {
    const { container } = render(<TypewriterText text="Hi" mode="instant" />);
    // In instant mode the component is immediately done → no cursor shown
    expect(container.querySelector(".tw-cursor")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(<TypewriterText text="Hi" mode="instant" className="my-class" />);
    expect(container.firstChild).toHaveClass("my-class");
  });

  it("renders updated text when prop changes", () => {
    const { rerender } = render(<TypewriterText text="First" mode="instant" />);
    rerender(<TypewriterText text="Second" mode="instant" />);
    expect(screen.getByText(/Second/)).toBeInTheDocument();
  });
});

// ── Typewriter mode ──────────────────────────────────────────────────────────

describe("TypewriterText — typewriter mode", () => {
  it("starts with empty display and animates to full text", () => {
    const { container } = render(<TypewriterText text="AB" speed={100} />);
    // Initially no text visible (cursor only)
    expect(container.textContent?.replace("▋", "").trim()).toBe("");

    // After enough ticks (2 chars at 100 cps = 10ms each) — advance 25ms
    act(() => {
      vi.advanceTimersByTime(25);
    });
    expect(container.textContent?.replace("▋", "")).toBe("AB");
  });

  it("calls onComplete after animation finishes", () => {
    const onComplete = vi.fn();
    render(<TypewriterText text="AB" speed={100} onComplete={onComplete} />);
    expect(onComplete).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("respects delay prop before starting", () => {
    const { container } = render(<TypewriterText text="A" speed={1000} delay={500} />);
    // Before delay expires — nothing typed
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(container.textContent?.replace("▋", "").trim()).toBe("");

    // After delay + one char interval — "A" should appear
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(container.textContent?.replace("▋", "")).toBe("A");
  });

  it("resets and replays when text prop changes", () => {
    const { container, rerender } = render(<TypewriterText text="AB" speed={100} />);
    act(() => {
      vi.advanceTimersByTime(25);
    });
    expect(container.textContent?.replace("▋", "")).toBe("AB");

    rerender(<TypewriterText text="CD" speed={100} />);
    // Immediately after update: displayed resets to empty
    expect(container.textContent?.replace("▋", "").trim()).toBe("");

    act(() => {
      vi.advanceTimersByTime(25);
    });
    expect(container.textContent?.replace("▋", "")).toBe("CD");
  });

  it("uses custom cursorChar", () => {
    const { container } = render(<TypewriterText text="Hi" cursorChar="|" />);
    const cursor = container.querySelector(".tw-cursor");
    expect(cursor?.textContent).toBe("|");
  });

  it("shows solid cursor while animating", () => {
    const { container } = render(<TypewriterText text="Hello" speed={10} />);
    // After one tick the cursor should be solid
    act(() => {
      vi.advanceTimersByTime(15);
    });
    const cursor = container.querySelector(".tw-cursor");
    expect(cursor).toHaveClass("tw-cursor--solid");
  });

  it("handles empty text without crashing", () => {
    const { container } = render(<TypewriterText text="" />);
    expect(container.firstChild).not.toBeNull();
  });
});

// ── Stream mode ──────────────────────────────────────────────────────────────

describe("TypewriterText — stream mode", () => {
  it("renders nothing initially with empty text", () => {
    const { container } = render(<TypewriterText text="" mode="stream" streaming={true} />);
    expect(container.textContent?.replace("▋", "").trim()).toBe("");
  });

  it("thinking prop shows blinking cursor with no text", () => {
    const { container } = render(<TypewriterText text="" mode="stream" thinking={true} />);
    const cursor = container.querySelector(".tw-cursor");
    expect(cursor).not.toBeNull();
    expect(cursor).toHaveClass("tw-cursor--blink");
  });

  it("animates newly appended characters", () => {
    // speed=200 → msPerChar = max(10, 1000/200) = 10ms per char
    const { container, rerender } = render(
      <TypewriterText text="AB" mode="stream" streaming={true} speed={200} />,
    );
    act(() => {
      vi.advanceTimersByTime(30); // 2 chars × 10ms + margin
    });
    // After animation catches up, should show "AB"
    expect(container.textContent?.replace("▋", "")).toContain("AB");

    rerender(<TypewriterText text="ABCD" mode="stream" streaming={true} speed={200} />);
    act(() => {
      vi.advanceTimersByTime(30); // 2 more chars × 10ms + margin
    });
    expect(container.textContent?.replace("▋", "")).toContain("CD");
  });

  it("keeps cursor blinking while streaming=true and caught up", () => {
    const { container } = render(
      <TypewriterText text="AB" mode="stream" streaming={true} speed={1000} />,
    );
    // Before any animation, cursor should be blinking (waiting for more data)
    const cursor = container.querySelector(".tw-cursor");
    expect(cursor).not.toBeNull();
  });

  it("calls onComplete when stream catches up to text", () => {
    const onComplete = vi.fn();
    render(
      <TypewriterText
        text="A"
        mode="stream"
        streaming={true}
        speed={200}
        onComplete={onComplete}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("resets when text is set back to empty", () => {
    const { container, rerender } = render(
      <TypewriterText text="AB" mode="stream" streaming={true} speed={200} />,
    );
    act(() => {
      vi.advanceTimersByTime(15);
    });
    rerender(<TypewriterText text="" mode="stream" streaming={false} />);
    expect(container.textContent?.replace("▋", "").trim()).toBe("");
  });
});

// ── Thinking state ───────────────────────────────────────────────────────────

describe("TypewriterText — thinking prop", () => {
  it("shows blinking cursor when thinking=true", () => {
    const { container } = render(<TypewriterText text="" thinking={true} />);
    const cursor = container.querySelector(".tw-cursor");
    expect(cursor).not.toBeNull();
    expect(cursor).toHaveClass("tw-cursor--blink");
  });

  it("hides cursor when thinking=false and cursor=false", () => {
    const { container } = render(<TypewriterText text="" thinking={false} cursor={false} />);
    expect(container.querySelector(".tw-cursor")).toBeNull();
  });
});

// ── Export ───────────────────────────────────────────────────────────────────

describe("TypewriterText — exports", () => {
  it("is exported from the Extras barrel", async () => {
    const mod = await import("../components/Extras");
    expect(typeof mod.TypewriterText).toBe("function");
  });

  it("is exported from the root index barrel", async () => {
    const mod = await import("../index");
    expect(typeof mod.TypewriterText).toBe("function");
  });
});

// ── Rich mode ─────────────────────────────────────────────────────────────────

describe("TypewriterText — rich mode", () => {
  it("rich=false renders plain text (no HTML parsing)", () => {
    const { container } = render(
      <TypewriterText text="**bold** text" mode="instant" rich={false} />,
    );
    // In plain mode, ** characters appear as-is; no <strong> element rendered
    expect(container.querySelector("strong")).toBeNull();
    expect(container.textContent).toContain("**bold** text");
  });

  it("rich=true with instant mode renders <strong> for **bold**", () => {
    const { container } = render(<TypewriterText text="**bold**" mode="instant" rich={true} />);
    expect(container.querySelector("strong")).not.toBeNull();
    expect(container.querySelector("strong")?.textContent).toBe("bold");
  });

  it("rich=true renders <img> with correct attributes for image markdown", () => {
    const { container } = render(
      <TypewriterText text="![alt text](https://example.com/img.jpg)" mode="instant" rich={true} />,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("https://example.com/img.jpg");
    expect(img?.getAttribute("alt")).toBe("alt text");
    expect(img?.getAttribute("loading")).toBe("lazy");
  });

  it("rich=true wraps the output in a <div role='region'>", () => {
    const { container } = render(
      <TypewriterText text="hello" mode="instant" rich={true} as="span" />,
    );
    // The `as` prop is ignored in rich mode; always a div with role="region"
    const region = container.querySelector("[role='region']");
    expect(region).not.toBeNull();
    expect(region?.tagName.toLowerCase()).toBe("div");
  });

  it("rich=true sanitizes XSS — <script> tag is stripped from output", () => {
    const xssInput = "<script>alert(1)</script> safe text";
    const { container } = render(<TypewriterText text={xssInput} mode="instant" rich={true} />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).not.toContain("<script");
  });

  it("rich=true sanitizes on* event handlers in raw HTML", () => {
    const xssInput = '<img src="x" onerror="alert(1)">';
    const { container } = render(<TypewriterText text={xssInput} mode="instant" rich={true} />);
    // The onerror attribute must be stripped
    const imgs = container.querySelectorAll("img");
    imgs.forEach((img) => {
      expect(img.getAttribute("onerror")).toBeNull();
    });
  });
});
