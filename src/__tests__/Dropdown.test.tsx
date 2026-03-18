import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown, type DropdownOption } from "../components/Dropdown";

const options: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("Dropdown (single)", () => {
  it("renders placeholder", () => {
    render(<Dropdown options={options} placeholder="Pick a fruit" />);
    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
  });

  it("opens menu on click", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} placeholder="Pick" />);
    await user.click(screen.getByText("Pick"));
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("selects an option and closes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown options={options} onChange={onChange} placeholder="Pick" />);
    await user.click(screen.getByText("Pick"));
    await user.click(screen.getByText("Apple"));
    expect(onChange).toHaveBeenCalledWith("apple", expect.objectContaining({ value: "apple" }));
  });

  it("renders with defaultValue", () => {
    render(<Dropdown options={options} defaultValue="banana" />);
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("renders controlled value", () => {
    render(<Dropdown options={options} value="cherry" />);
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} disabled placeholder="Disabled" />);
    await user.click(screen.getByText("Disabled"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("Dropdown (multiple)", () => {
  it("renders with placeholder", () => {
    render(<Dropdown options={options} multiple placeholder="Select items" />);
    expect(screen.getByText("Select items")).toBeInTheDocument();
  });

  it("toggles selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Dropdown
        options={options}
        multiple
        onSelectionChange={onSelectionChange}
        placeholder="Multi"
      />,
    );
    await user.click(screen.getByText("Multi"));
    await user.click(screen.getByText("Apple"));
    expect(onSelectionChange).toHaveBeenCalledWith(["apple"]);
  });

  it("renders with defaultSelected", async () => {
    render(<Dropdown options={options} multiple defaultSelected={["apple", "banana"]} />);
    // Badge should show count
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("Dropdown (cascading)", () => {
  const cascadeOptions: DropdownOption[] = [
    {
      value: "us",
      label: "USA",
      children: [
        { value: "ny", label: "New York" },
        { value: "ca", label: "California" },
      ],
    },
    { value: "uk", label: "UK" },
  ];

  it("renders top-level options", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={cascadeOptions} placeholder="Country" />);
    await user.click(screen.getByText("Country"));
    expect(screen.getByText("USA")).toBeInTheDocument();
    expect(screen.getByText("UK")).toBeInTheDocument();
  });

  it("selects leaf option from cascade", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown options={cascadeOptions} onChange={onChange} placeholder="Country" />);
    await user.click(screen.getByText("Country"));
    await user.click(screen.getByText("UK"));
    expect(onChange).toHaveBeenCalledWith("uk", expect.objectContaining({ value: "uk" }));
  });
});
