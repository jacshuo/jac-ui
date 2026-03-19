import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextBox } from "../components/Primitives/TextBox";

describe("TextBox", () => {
  it("renders a textarea", () => {
    render(<TextBox placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text").tagName).toBe("TEXTAREA");
  });

  it("supports controlled value", () => {
    render(<TextBox value="hello" onChange={() => {}} />);
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
  });

  it("supports uncontrolled defaultValue", () => {
    render(<TextBox defaultValue="initial" />);
    expect(screen.getByDisplayValue("initial")).toBeInTheDocument();
  });

  it("fires onChange on typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextBox onChange={onChange} placeholder="type" />);
    await user.type(screen.getByPlaceholderText("type"), "abc");
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("shows word count when showWordCount is true", () => {
    render(<TextBox showWordCount defaultValue="hello world" />);
    expect(screen.getByText("2 words")).toBeInTheDocument();
  });

  it("shows word count with maxWords", () => {
    render(<TextBox maxWords={10} defaultValue="hello world" />);
    expect(screen.getByText("2 / 10 words")).toBeInTheDocument();
  });

  it("shows over-limit styling when exceeding maxWords", () => {
    render(<TextBox maxWords={1} defaultValue="hello world" />);
    const counter = screen.getByText("2 / 1 words");
    expect(counter).toHaveClass("text-danger-500");
  });

  it("counts CJK characters individually", () => {
    render(<TextBox showWordCount defaultValue="你好世界" />);
    expect(screen.getByText("4 words")).toBeInTheDocument();
  });

  it("counts mixed CJK and English correctly", () => {
    render(<TextBox showWordCount defaultValue="hello 你好" />);
    // "hello" = 1 word, 你 = 1, 好 = 1 → 3
    expect(screen.getByText("3 words")).toBeInTheDocument();
  });

  it("applies error state class", () => {
    const { container } = render(<TextBox state="error" />);
    const textarea = container.querySelector("textarea");
    expect(textarea?.className).toContain("danger");
  });

  it("applies size classes", () => {
    const { container } = render(<TextBox size="lg" />);
    const textarea = container.querySelector("textarea");
    expect(textarea?.className).toContain("text-base");
  });

  it("applies disabled state", () => {
    render(<TextBox disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });

  it("merges custom className", () => {
    const { container } = render(<TextBox className="my-box" />);
    expect(container.firstChild).toHaveClass("my-box");
  });
});
