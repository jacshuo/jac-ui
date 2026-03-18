import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tree, TreeItem } from "../components/Tree";

describe("Tree", () => {
  it('renders with role="tree"', () => {
    render(
      <Tree>
        <TreeItem label="A" />
      </Tree>,
    );
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });

  it("renders tree items", () => {
    render(
      <Tree>
        <TreeItem label="Home" />
        <TreeItem label="About" />
      </Tree>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders nested items", () => {
    render(
      <Tree>
        <TreeItem label="Folder">
          <TreeItem label="File.txt" />
        </TreeItem>
      </Tree>,
    );
    expect(screen.getByText("Folder")).toBeInTheDocument();
    expect(screen.getByText("File.txt")).toBeInTheDocument();
  });

  it("collapses/expands parent on click", async () => {
    const user = userEvent.setup();
    render(
      <Tree defaultExpandedKeys={new Set(["Parent"])}>
        <TreeItem label="Parent">
          <TreeItem label="Child" />
        </TreeItem>
      </Tree>,
    );
    expect(screen.getByText("Child")).toBeInTheDocument();

    // Click to collapse
    await user.click(screen.getByText("Parent"));
    // Child should be hidden via CSS grid animation, but the item should still have aria-expanded=false
    const parentItem = screen.getByText("Parent").closest('[role="treeitem"]');
    expect(parentItem).toHaveAttribute("aria-expanded", "false");
  });

  it("renders with defaultExpandedKeys='all' (children visible)", () => {
    render(
      <Tree defaultExpandedKeys="all">
        <TreeItem label="Root">
          <TreeItem label="Nested" />
        </TreeItem>
      </Tree>,
    );
    // When all expanded, nested items should be visible
    expect(screen.getByText("Nested")).toBeInTheDocument();
  });

  it("renders actions slot on TreeItem", () => {
    render(
      <Tree>
        <TreeItem label="Document" actions={<button data-testid="del">🗑</button>} />
      </Tree>,
    );
    expect(screen.getByTestId("del")).toBeInTheDocument();
  });

  it("renders icon on TreeItem", () => {
    render(
      <Tree>
        <TreeItem label="Music" icon={<span data-testid="icon">🎵</span>} />
      </Tree>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("merges custom className on Tree", () => {
    const { container } = render(
      <Tree className="my-tree">
        <TreeItem label="X" />
      </Tree>,
    );
    expect(container.firstChild).toHaveClass("my-tree");
  });
});
