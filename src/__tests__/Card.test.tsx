import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  HorizontalCard,
} from "../components/Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders as a div", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("applies intent variant", () => {
    const { container } = render(<Card intent="elevated">X</Card>);
    expect(container.firstChild).toHaveClass("shadow-md");
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="my-card">X</Card>);
    expect(container.firstChild).toHaveClass("my-card");
  });

  it("passes HTML attributes", () => {
    render(<Card data-testid="card">X</Card>);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<CardHeader className="extra">H</CardHeader>);
    expect(container.firstChild).toHaveClass("extra");
  });
});

describe("CardTitle", () => {
  it("renders as h3", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title").tagName).toBe("H3");
  });
});

describe("CardDescription", () => {
  it("renders as p", () => {
    render(<CardDescription>Desc</CardDescription>);
    expect(screen.getByText("Desc").tagName).toBe("P");
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Body</CardContent>);
    expect(screen.getByText("Body")).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<CardFooter className="foot">F</CardFooter>);
    expect(container.firstChild).toHaveClass("foot");
  });
});

describe("Card composition", () => {
  it("renders full card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
          <CardDescription>My Description</CardDescription>
        </CardHeader>
        <CardContent>Card body</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My Description")).toBeInTheDocument();
    expect(screen.getByText("Card body")).toBeInTheDocument();
    expect(screen.getByText("Card footer")).toBeInTheDocument();
  });
});

describe("HorizontalCard", () => {
  it("renders children and image", () => {
    render(
      <HorizontalCard media={{ src: "https://example.com/img.jpg", alt: "photo" }}>
        <CardTitle>Horizontal</CardTitle>
      </HorizontalCard>,
    );
    expect(screen.getByText("Horizontal")).toBeInTheDocument();
    expect(screen.getByAltText("photo")).toBeInTheDocument();
  });

  it("renders icon instead of image when no src", () => {
    render(
      <HorizontalCard media={{ icon: <span data-testid="icon">★</span> }}>
        <span>With Icon</span>
      </HorizontalCard>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies mediaPosition right", () => {
    const { container } = render(
      <HorizontalCard media={{ src: "img.jpg" }} mediaPosition="right">
        <span>Right</span>
      </HorizontalCard>,
    );
    expect(container.firstChild).toHaveClass("flex-row-reverse");
  });

  it("merges className", () => {
    const { container } = render(
      <HorizontalCard media={{ src: "img.jpg" }} className="custom">
        <span>X</span>
      </HorizontalCard>,
    );
    expect(container.firstChild).toHaveClass("custom");
  });
});
