import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScatterChart } from "../components/Chart/ScatterChart";

const series1 = {
  id: "s1",
  name: "Group A",
  data: [
    { x: 10, y: 20 },
    { x: 15, y: 35 },
    { x: 20, y: 25 },
    { x: 25, y: 40 },
    { x: 30, y: 30 },
  ],
};

const series2 = {
  id: "s2",
  name: "Group B",
  data: [
    { x: 12, y: 50 },
    { x: 18, y: 45 },
    { x: 22, y: 55 },
    { x: 28, y: 48 },
    { x: 35, y: 60 },
  ],
};

describe("ScatterChart", () => {
  it("renders without crashing with minimal props", () => {
    const { container } = render(<ScatterChart series={[series1]} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders the SVG chart element with role=img", () => {
    render(<ScatterChart series={[series1]} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders chart title when provided", () => {
    render(<ScatterChart series={[series1]} title="Data Distribution" />);
    expect(screen.getByText("Data Distribution")).toBeInTheDocument();
  });

  it("renders empty state when no series provided", () => {
    render(<ScatterChart series={[]} emptyText="No scatter data" />);
    expect(screen.getByText("No scatter data")).toBeInTheDocument();
  });

  it("renders empty state when series has empty data", () => {
    render(
      <ScatterChart series={[{ id: "empty", name: "Empty", data: [] }]} emptyText="No points" />,
    );
    expect(screen.getByText("No points")).toBeInTheDocument();
  });

  it("renders legend with correct series names", () => {
    render(<ScatterChart series={[series1, series2]} legend />);
    expect(screen.getByText("Group A")).toBeInTheDocument();
    expect(screen.getByText("Group B")).toBeInTheDocument();
  });

  it("does not render legend when legend=false", () => {
    render(<ScatterChart series={[series1]} legend={false} />);
    expect(screen.queryByText("Group A")).toBeNull();
  });

  it("renders legend items as buttons", () => {
    render(<ScatterChart series={[series1, series2]} legend />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("clicking legend item toggles aria-pressed", () => {
    render(<ScatterChart series={[series1, series2]} legend />);
    const button = screen.getByRole("button", { name: /Group A/ });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders with jitter enabled", () => {
    const { container } = render(<ScatterChart series={[series1]} jitter />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with jitter disabled", () => {
    const { container } = render(<ScatterChart series={[series1]} jitter={false} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with linkedLines enabled", () => {
    const { container } = render(<ScatterChart series={[series1]} linkedLines />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with clusters enabled", () => {
    const { container } = render(<ScatterChart series={[series1]} clusters />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with custom dotRadius", () => {
    const { container } = render(<ScatterChart series={[series1]} dotRadius={8} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with custom dotOpacity", () => {
    const { container } = render(<ScatterChart series={[series1]} dotOpacity={0.5} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with custom height", () => {
    render(<ScatterChart series={[series1]} height={400} />);
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("applies custom className", () => {
    const { container } = render(<ScatterChart series={[series1]} className="scatter-test" />);
    expect(container.firstChild).toHaveClass("scatter-test");
  });

  it("renders with legendPosition left", () => {
    render(<ScatterChart series={[series1, series2]} legend legendPosition="left" />);
    expect(screen.getByText("Group A")).toBeInTheDocument();
  });

  it("renders with xAxis and yAxis labels", () => {
    const { container } = render(
      <ScatterChart series={[series1]} xAxis={{ label: "X Axis" }} yAxis={{ label: "Y Axis" }} />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("snapshot smoke test", () => {
    const { container } = render(
      <ScatterChart
        title="Smoke Test"
        series={[series1, series2]}
        height={300}
        animateOnMount={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
