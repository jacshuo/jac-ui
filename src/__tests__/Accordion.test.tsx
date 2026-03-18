import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/Accordion";

function renderAccordion(type: "single" | "multiple" = "single") {
  return render(
    <Accordion type={type} defaultValue={[]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion", () => {
  it("renders triggers", () => {
    renderAccordion();
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
  });

  it("starts collapsed (aria-expanded=false)", () => {
    renderAccordion();
    const triggers = screen.getAllByRole("button");
    triggers.forEach((t) => expect(t).toHaveAttribute("aria-expanded", "false"));
  });

  it("expands item on click (single mode)", async () => {
    const user = userEvent.setup();
    renderAccordion("single");
    await user.click(screen.getByText("Section 1"));
    expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-expanded", "true");
  });

  it("collapses previous in single mode", async () => {
    const user = userEvent.setup();
    renderAccordion("single");
    await user.click(screen.getByText("Section 1"));
    await user.click(screen.getByText("Section 2"));
    expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("button")[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("allows multiple open in multiple mode", async () => {
    const user = userEvent.setup();
    renderAccordion("multiple");
    await user.click(screen.getByText("Section 1"));
    await user.click(screen.getByText("Section 2"));
    expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("button")[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles off on second click", async () => {
    const user = userEvent.setup();
    renderAccordion("single");
    await user.click(screen.getByText("Section 1"));
    expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByText("Section 1"));
    expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("renders with defaultValue expanded", () => {
    render(
      <Accordion defaultValue={["a"]}>
        <AccordionItem value="a">
          <AccordionTrigger>Open</AccordionTrigger>
          <AccordionContent>Expanded</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onValueChange in controlled mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Accordion value={[]} onValueChange={onValueChange}>
        <AccordionItem value="x">
          <AccordionTrigger>Click</AccordionTrigger>
          <AccordionContent>Ctrl</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByText("Click"));
    expect(onValueChange).toHaveBeenCalledWith(["x"]);
  });
});
