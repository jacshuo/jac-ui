import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownButton, type DropdownItem } from "../components/DropdownButton";

const items: DropdownItem[] = [
  { label: "Edit", onClick: vi.fn() },
  { label: "Delete", onClick: vi.fn() },
];

describe("DropdownButton", () => {
  it("renders the button label", () => {
    render(<DropdownButton label="Actions" items={items} />);
    expect(screen.getByRole("button", { name: /Actions/i })).toBeInTheDocument();
  });

  it("opens menu on click", async () => {
    const user = userEvent.setup();
    render(<DropdownButton label="Menu" items={items} />);
    await user.click(screen.getByRole("button", { name: /Menu/i }));
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls item onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const testItems: DropdownItem[] = [{ label: "Save", onClick }];
    render(<DropdownButton label="Actions" items={testItems} />);
    await user.click(screen.getByRole("button", { name: /Actions/i }));
    await user.click(screen.getByText("Save"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<DropdownButton label="Disabled" items={items} disabled />);
    await user.click(screen.getByRole("button", { name: /Disabled/i }));
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("renders with align right", async () => {
    const user = userEvent.setup();
    render(<DropdownButton label="Right" items={items} align="right" />);
    await user.click(screen.getByRole("button", { name: /Right/i }));
    const menu = screen.getByText("Edit").closest('[role="menu"]');
    expect(menu).toHaveClass("right-0");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<DropdownButton label="Close" items={items} animated={false} />);
    await user.click(screen.getByRole("button", { name: /Close/i }));
    expect(screen.getByText("Edit")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("supports multiple selection mode", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const multiItems: DropdownItem[] = [
      { key: "a", label: "Option A" },
      { key: "b", label: "Option B" },
    ];
    render(
      <DropdownButton
        label="Multi"
        items={multiItems}
        multiple
        selected={[]}
        onSelectionChange={onSelectionChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Multi/i }));
    await user.click(screen.getByText("Option A"));
    expect(onSelectionChange).toHaveBeenCalledWith(["a"]);
  });
});
