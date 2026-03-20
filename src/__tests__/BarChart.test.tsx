import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BarChart } from "../components/Chart/BarChart";

const series1 = {
  id: "s1",
  name: "Product A",
  data: [
    { x: "Q1", y: 200 },
    { x: "Q2", y: 250 },
    { x: "Q3", y: 230 },
  ],
};

const series2 = {
  id: "s2",
  name: "Product B",
  data: [
    { x: "Q1", y: 150 },
    { x: "Q2", y: 180 },
    { x: "Q3", y: 200 },
  ],
};

describe("BarChart", () => {
  it("renders without crashing with minimal props", () => {
    const { container } = render(<BarChart series={[series1]} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders the SVG chart element with role=img", () => {
    render(<BarChart series={[series1]} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders chart title when provided", () => {
    render(<BarChart series={[series1]} title="Quarterly Sales" />);
    expect(screen.getByText("Quarterly Sales")).toBeInTheDocument();
  });

  it("renders empty state when no series provided", () => {
    render(<BarChart series={[]} emptyText="No bar data" />);
    expect(screen.getByText("No bar data")).toBeInTheDocument();
  });

  it("renders empty state when series has empty data", () => {
    render(<BarChart series={[{ id: "empty", name: "Empty", data: [] }]} emptyText="Empty data" />);
    expect(screen.getByText("Empty data")).toBeInTheDocument();
  });

  it("renders legend with correct series names", () => {
    render(<BarChart series={[series1, series2]} legend />);
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("does not render legend when legend=false", () => {
    render(<BarChart series={[series1]} legend={false} />);
    expect(screen.queryByText("Product A")).toBeNull();
  });

  it("renders legend items as buttons", () => {
    render(<BarChart series={[series1, series2]} legend />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("clicking legend item toggles aria-pressed", () => {
    render(<BarChart series={[series1, series2]} legend />);
    const button = screen.getByRole("button", { name: /Product A/ });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders in grouped mode (default)", () => {
    const { container } = render(<BarChart series={[series1, series2]} grouped />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders in stacked mode", () => {
    const { container } = render(<BarChart series={[series1, series2]} grouped={false} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders in horizontal orientation", () => {
    const { container } = render(<BarChart series={[series1]} orientation="horizontal" />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders in vertical orientation (default)", () => {
    const { container } = render(<BarChart series={[series1]} orientation="vertical" />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with custom barRadius", () => {
    const { container } = render(<BarChart series={[series1]} barRadius={6} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with custom height", () => {
    render(<BarChart series={[series1]} height={400} />);
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("applies custom className", () => {
    const { container } = render(<BarChart series={[series1]} className="bar-chart-test" />);
    expect(container.firstChild).toHaveClass("bar-chart-test");
  });

  it("renders with legendPosition bottom", () => {
    render(<BarChart series={[series1, series2]} legend legendPosition="bottom" />);
    expect(screen.getByText("Product A")).toBeInTheDocument();
  });

  it("snapshot smoke test", () => {
    const { container } = render(
      <BarChart
        title="Smoke Test"
        series={[series1, series2]}
        height={300}
        animateOnMount={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
