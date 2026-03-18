import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("cn() utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional values from clsx", () => {
    const condition = false;
    expect(cn("base", condition && "hidden", "extra")).toBe("base extra");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("merges object syntax from clsx", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("merges array syntax from clsx", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });
});
