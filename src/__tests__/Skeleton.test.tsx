import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "../components/Feedback/Skeleton";

describe("Skeleton — variant shapes", () => {
  it("renders with role=presentation and aria-hidden by default", () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId("sk");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("role", "presentation");
  });

  it("text variant has rounded-sm class", () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(container.firstChild).toHaveClass("rounded-sm");
  });

  it("circular variant has rounded-full class", () => {
    const { container } = render(<Skeleton variant="circular" width={40} height={40} />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("rectangular variant has rounded-none class", () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    expect(container.firstChild).toHaveClass("rounded-none");
  });

  it("rounded variant has rounded-md class", () => {
    const { container } = render(<Skeleton variant="rounded" />);
    expect(container.firstChild).toHaveClass("rounded-md");
  });
});

describe("Skeleton — animation modes", () => {
  it("pulse (default) adds animate-pulse class", () => {
    const { container } = render(<Skeleton animation="pulse" />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("wave adds skeleton-wave class", () => {
    const { container } = render(<Skeleton animation="wave" />);
    expect(container.firstChild).toHaveClass("skeleton-wave");
  });

  it("none adds no animation class", () => {
    const { container } = render(<Skeleton animation="none" />);
    const el = container.firstChild as HTMLElement;
    expect(el).not.toHaveClass("animate-pulse");
    expect(el).not.toHaveClass("skeleton-wave");
  });
});

describe("Skeleton — size props", () => {
  it("applies numeric width as px inline style", () => {
    render(<Skeleton width={200} data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveStyle({ width: "200px" });
  });

  it("applies string width as-is", () => {
    render(<Skeleton width="12rem" data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveStyle({ width: "12rem" });
  });

  it("applies numeric height as px inline style", () => {
    render(<Skeleton height={80} data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveStyle({ height: "80px" });
  });

  it("applies string height as-is", () => {
    render(<Skeleton height="4rem" data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveStyle({ height: "4rem" });
  });
});

describe("Skeleton — lines prop (multi-line text)", () => {
  it("renders N children when lines > 1", () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    // The outer span wraps N inner spans
    const inner = container.firstElementChild!.children;
    expect(inner.length).toBe(3);
  });

  it("last line has 60% width", () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const spans = container.firstElementChild!.children;
    const lastSpan = spans[spans.length - 1] as HTMLElement;
    expect(lastSpan.style.width).toBe("60%");
  });

  it("non-last lines default to 100% width", () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const spans = container.firstElementChild!.children;
    const firstSpan = spans[0] as HTMLElement;
    expect(firstSpan.style.width).toBe("100%");
  });

  it("falls back to single element when lines=1", () => {
    const { container } = render(<Skeleton variant="text" lines={1} />);
    // lines=1 is not > 1 so renders single span
    expect(container.firstChild!.nodeName).toBe("SPAN");
    expect(container.firstElementChild!.children.length).toBe(0);
  });

  it("renders single span when lines is undefined", () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(container.firstChild!.nodeName).toBe("SPAN");
    expect(container.firstElementChild!.children.length).toBe(0);
  });
});

describe("Skeleton — className passthrough", () => {
  it("merges additional className", () => {
    render(<Skeleton className="my-custom" data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveClass("my-custom");
  });
});

describe("Skeleton — default variant/animation", () => {
  it("defaults to text variant (rounded-sm)", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("rounded-sm");
  });

  it("defaults to pulse animation (animate-pulse)", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });
});

describe("Skeleton — skeletonVariants is exported from theme", () => {
  it("skeletonVariants is a function", async () => {
    const { skeletonVariants } = await import("../styles/theme");
    expect(typeof skeletonVariants).toBe("function");
  });
});
