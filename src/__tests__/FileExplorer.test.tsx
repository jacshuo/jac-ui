import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileExplorer, type FileExplorerItem } from "../components/Extras/FileExplorer";

const files: FileExplorerItem[] = [
  { name: "Documents", path: "/Documents", type: "directory" },
  { name: "photo.jpg", path: "/photo.jpg", type: "file", size: 102400, extension: ".jpg" },
  { name: "notes.txt", path: "/notes.txt", type: "file", size: 256, extension: ".txt" },
  { name: "app.tsx", path: "/app.tsx", type: "file", size: 5120, extension: ".tsx" },
];

describe("FileExplorer", () => {
  it("renders the window title", () => {
    render(<FileExplorer files={files} title="My Files" />);
    expect(screen.getByText("My Files")).toBeInTheDocument();
  });

  it("renders file names", () => {
    render(<FileExplorer files={files} />);
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
    expect(screen.getByText("app.tsx")).toBeInTheDocument();
  });

  it("renders default title when none provided", () => {
    render(<FileExplorer files={files} />);
    expect(screen.getByText("File Explorer")).toBeInTheDocument();
  });

  it("can be hidden via visible prop", () => {
    const { container } = render(<FileExplorer files={files} visible={false} />);
    // When not visible the root should be empty or hidden
    expect(container.innerHTML).toBe("");
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<FileExplorer files={files} onClose={onClose} />);
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders with custom className", () => {
    const { container } = render(<FileExplorer files={files} className="my-explorer" />);
    // The outermost wrapper should have the class
    expect(container.firstChild).toHaveClass("my-explorer");
  });
});
