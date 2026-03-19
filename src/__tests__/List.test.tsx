import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { List, ListItem } from "../components/DataDisplay/List";

describe("List", () => {
  it("renders as ul", () => {
    const { container } = render(
      <List>
        <ListItem>Item</ListItem>
      </List>,
    );
    expect(container.querySelector("ul")).toBeTruthy();
  });

  it("renders children items", () => {
    render(
      <List>
        <ListItem>Apple</ListItem>
        <ListItem>Banana</ListItem>
      </List>,
    );
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <List className="my-list">
        <ListItem>X</ListItem>
      </List>,
    );
    expect(container.firstChild).toHaveClass("my-list");
  });
});

describe("ListItem", () => {
  it("renders as li", () => {
    const { container } = render(<ListItem>Item</ListItem>);
    expect(container.firstChild?.nodeName).toBe("LI");
  });

  it("renders children", () => {
    render(<ListItem>Hello</ListItem>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    render(<ListItem actions={<button data-testid="action">Edit</button>}>File.txt</ListItem>);
    expect(screen.getByText("File.txt")).toBeInTheDocument();
    expect(screen.getByTestId("action")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<ListItem className="custom">X</ListItem>);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("passes HTML attributes", () => {
    render(<ListItem data-testid="li">X</ListItem>);
    expect(screen.getByTestId("li")).toBeInTheDocument();
  });
});
