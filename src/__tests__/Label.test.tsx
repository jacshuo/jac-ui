import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "../components/Label";

describe("Label", () => {
  it("renders as a label element", () => {
    render(<Label>Username</Label>);
    const el = screen.getByText("Username");
    expect(el.tagName).toBe("LABEL");
  });

  it("associates with input via htmlFor", () => {
    render(<Label htmlFor="email">Email</Label>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email");
  });

  it("applies size variant", () => {
    const { container } = render(<Label size="lg">Big</Label>);
    expect(container.firstChild).toHaveClass("text-base");
  });

  it("applies intent variant", () => {
    const { container } = render(<Label intent="muted">Muted</Label>);
    expect(container.firstChild).toHaveClass("text-primary-400");
  });

  it("merges custom className", () => {
    const { container } = render(<Label className="my-label">X</Label>);
    expect(container.firstChild).toHaveClass("my-label");
  });
});
