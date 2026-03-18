import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chat, type ChatMessage } from "../components/Chat";

beforeAll(() => {
  Element.prototype.scrollIntoView = () => {};
});

const messages: ChatMessage[] = [
  { id: 1, sender: "Alice", content: "Hello!", time: "10:00 AM", self: false },
  { id: 2, sender: "Bob", content: "Hi there!", time: "10:01 AM", self: true },
  { id: 3, sender: "Alice", content: "How are you?", self: false },
];

describe("Chat", () => {
  it("renders all messages", () => {
    render(<Chat messages={messages} />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(screen.getByText("How are you?")).toBeInTheDocument();
  });

  it("renders sender names", () => {
    render(<Chat messages={messages} />);
    expect(screen.getAllByText("Alice").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders timestamps when present", () => {
    render(<Chat messages={messages} />);
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("10:01 AM")).toBeInTheDocument();
  });

  it("renders fallback avatar (first letter) when no avatar provided", () => {
    render(<Chat messages={[{ id: 1, sender: "Zara", content: "Hi" }]} />);
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  it("renders emoji/text avatar", () => {
    render(<Chat messages={[{ id: 1, sender: "Bot", avatar: "🤖", content: "beep" }]} />);
    expect(screen.getByText("🤖")).toBeInTheDocument();
  });

  it("renders image avatar when URL provided", () => {
    render(
      <Chat
        messages={[
          { id: 1, sender: "User", avatar: "https://example.com/avatar.jpg", content: "hi" },
        ]}
      />,
    );
    expect(screen.getByAltText("User")).toBeInTheDocument();
  });

  it("renders ReactNode avatar", () => {
    render(
      <Chat
        messages={[
          {
            id: 1,
            sender: "X",
            avatar: <span data-testid="custom-avatar">A</span>,
            content: "test",
          },
        ]}
      />,
    );
    expect(screen.getByTestId("custom-avatar")).toBeInTheDocument();
  });

  it("applies mode=left (all messages on left)", () => {
    const { container } = render(<Chat messages={messages} mode="left" />);
    // In left mode, self messages should NOT have flex-row-reverse
    const bubbles = container.querySelectorAll('[class*="flex-row-reverse"]');
    expect(bubbles.length).toBe(0);
  });

  it("applies mode=split (self on right)", () => {
    const { container } = render(<Chat messages={messages} mode="split" />);
    const reverseBubbles = container.querySelectorAll('[class*="flex-row-reverse"]');
    expect(reverseBubbles.length).toBe(1); // Only Bob's message
  });

  it("merges custom className", () => {
    const { container } = render(<Chat messages={[]} className="my-chat" />);
    expect(container.firstChild).toHaveClass("my-chat");
  });

  it("renders empty state with no messages", () => {
    const { container } = render(<Chat messages={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
