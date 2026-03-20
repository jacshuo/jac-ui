import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LineChart } from "../components/Chart/LineChart";

const series1 = {
  id: "s1",
  name: "Revenue",
  data: [
    { x: "Jan", y: 100 },
    { x: "Feb", y: 120 },
    { x: "Mar", y: 110 },
  ],
};

const series2 = {
  id: "s2",
  name: "Costs",
  data: [
    { x: "Jan", y: 80 },
    { x: "Feb", y: 90 },
    { x: "Mar", y: 85 },
  ],
};

describe("LineChart", () => {
  it("renders without crashing with minimal props", () => {
    const { container } = render(<LineChart series={[series1]} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders the SVG chart element with role=img", () => {
    render(<LineChart series={[series1]} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders chart title when provided", () => {
    render(<LineChart series={[series1]} title="Monthly Revenue" />);
    expect(screen.getByText("Monthly Revenue")).toBeInTheDocument();
  });

  it("renders empty state when no series provided", () => {
    render(<LineChart series={[]} emptyText="No data available" />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders empty state with empty data", () => {
    render(
      <LineChart series={[{ id: "empty", name: "Empty", data: [] }]} emptyText="Chart is empty" />,
    );
    expect(screen.getByText("Chart is empty")).toBeInTheDocument();
  });

  it("renders legend with correct number of items", () => {
    render(<LineChart series={[series1, series2]} legend />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Costs")).toBeInTheDocument();
  });

  it("does not render legend when legend=false", () => {
    render(<LineChart series={[series1]} legend={false} />);
    expect(screen.queryByText("Revenue")).toBeNull();
  });

  it("renders legend items as buttons", () => {
    render(<LineChart series={[series1, series2]} legend />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("legend button has aria-pressed attribute", () => {
    render(<LineChart series={[series1]} legend />);
    const button = screen.getByRole("button", { name: /Revenue/ });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("clicking legend item toggles aria-pressed", () => {
    render(<LineChart series={[series1, series2]} legend />);
    const button = screen.getByRole("button", { name: /Revenue/ });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders with smooth prop", () => {
    const { container } = render(<LineChart series={[series1]} smooth />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with area prop", () => {
    const { container } = render(<LineChart series={[series1]} area />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with showDots=false", () => {
    const { container } = render(<LineChart series={[series1]} showDots={false} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with custom height", () => {
    render(<LineChart series={[series1]} height={400} />);
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("height", "400");
  });

  it("applies custom className", () => {
    const { container } = render(<LineChart series={[series1]} className="my-chart" />);
    expect(container.firstChild).toHaveClass("my-chart");
  });

  it("renders with legendPosition top", () => {
    const { container } = render(
      <LineChart series={[series1, series2]} legendPosition="top" legend />,
    );
    expect(container.firstChild).not.toBeNull();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders with numeric x values", () => {
    const numSeries = {
      id: "n1",
      name: "Numeric",
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 15 },
      ],
    };
    const { container } = render(<LineChart series={[numSeries]} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with y2Axis and y2Series", () => {
    const { container } = render(
      <LineChart series={[series1, series2]} y2Axis={{ label: "Secondary" }} y2Series={["s2"]} />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("snapshot smoke test", () => {
    const { container } = render(
      <LineChart
        title="Smoke Test"
        series={[series1, series2]}
        height={300}
        animateOnMount={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
