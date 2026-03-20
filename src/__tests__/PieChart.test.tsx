import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PieChart } from "../components/Chart/PieChart";

const slices = [
  { id: "chrome", label: "Chrome", value: 65 },
  { id: "safari", label: "Safari", value: 19 },
  { id: "firefox", label: "Firefox", value: 4 },
  { id: "edge", label: "Edge", value: 12 },
];

const singleSlice = [{ id: "all", label: "All", value: 100 }];

describe("PieChart", () => {
  it("renders without crashing with minimal props", () => {
    const { container } = render(<PieChart data={slices} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders the SVG chart element", () => {
    const { container } = render(<PieChart data={slices} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("renders chart title when provided", () => {
    render(<PieChart data={slices} title="Browser Share" />);
    expect(screen.getByText("Browser Share")).toBeInTheDocument();
  });

  it("renders empty state when no data provided", () => {
    render(<PieChart data={[]} emptyText="No pie data" />);
    expect(screen.getByText("No pie data")).toBeInTheDocument();
  });

  it("renders empty state when all values are zero", () => {
    render(<PieChart data={[{ id: "a", label: "A", value: 0 }]} emptyText="All zeros" />);
    expect(screen.getByText("All zeros")).toBeInTheDocument();
  });

  it("renders legend with correct label names", () => {
    render(<PieChart data={slices} legend />);
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("Safari")).toBeInTheDocument();
    expect(screen.getByText("Firefox")).toBeInTheDocument();
    expect(screen.getByText("Edge")).toBeInTheDocument();
  });

  it("does not render legend when legend=false", () => {
    render(<PieChart data={slices} legend={false} />);
    expect(screen.queryByText("Chrome")).toBeNull();
  });

  it("renders legend items as buttons", () => {
    render(<PieChart data={slices} legend />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(slices.length);
  });

  it("clicking legend item toggles aria-pressed", () => {
    render(<PieChart data={slices} legend />);
    const button = screen.getByRole("button", { name: /Chrome/ });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders in donut mode", () => {
    const { container } = render(<PieChart data={slices} donut />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders centerLabel for donut mode", () => {
    render(<PieChart data={slices} donut centerLabel="Total: 65%" centerSubLabel="Main" />);
    expect(screen.getByText("Total: 65%")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("renders with labelType=percent", () => {
    const { container } = render(<PieChart data={slices} labelType="percent" />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with labelType=label", () => {
    const { container } = render(<PieChart data={slices} labelType="label" />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with labelType=none", () => {
    const { container } = render(<PieChart data={slices} labelType="none" />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders full-circle slice correctly (single slice edge case)", () => {
    const { container } = render(<PieChart data={singleSlice} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with explodeOnHover", () => {
    const { container } = render(<PieChart data={slices} explodeOnHover />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with custom padAngle", () => {
    const { container } = render(<PieChart data={slices} padAngle={4} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with custom startAngle", () => {
    const { container } = render(<PieChart data={slices} startAngle={90} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(<PieChart data={slices} className="my-pie" />);
    expect(container.firstChild).toHaveClass("my-pie");
  });

  it("snapshot smoke test", () => {
    const { container } = render(
      <PieChart data={slices} title="Smoke Test" animateOnMount={false} />,
    );
    expect(container).toMatchSnapshot();
  });
});
