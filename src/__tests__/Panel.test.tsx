import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Panel, PanelHeader, PanelContent } from "../components/Layout/Panel";

describe("Panel", () => {
  it("renders children", () => {
    render(<Panel>Panel body</Panel>);
    expect(screen.getByText("Panel body")).toBeInTheDocument();
  });

  it("renders as a div", () => {
    const { container } = render(<Panel>X</Panel>);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("merges custom className", () => {
    const { container } = render(<Panel className="my-panel">X</Panel>);
    expect(container.firstChild).toHaveClass("my-panel");
  });

  it("passes HTML attributes", () => {
    render(<Panel data-testid="panel">X</Panel>);
    expect(screen.getByTestId("panel")).toBeInTheDocument();
  });
});

describe("PanelHeader", () => {
  it("renders children", () => {
    render(<PanelHeader>Settings</PanelHeader>);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<PanelHeader className="extra">H</PanelHeader>);
    expect(container.firstChild).toHaveClass("extra");
  });
});

describe("PanelContent", () => {
  it("renders children", () => {
    render(<PanelContent>Content here</PanelContent>);
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<PanelContent className="extra">C</PanelContent>);
    expect(container.firstChild).toHaveClass("extra");
  });
});

describe("Panel composition", () => {
  it("renders full panel structure", () => {
    render(
      <Panel>
        <PanelHeader>Title</PanelHeader>
        <PanelContent>Body text</PanelContent>
      </Panel>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });
});
