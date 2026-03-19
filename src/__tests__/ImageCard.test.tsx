import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ImageCard,
  ImageCardBody,
  ImageCardTitle,
  ImageCardDescription,
  ImageCardActions,
} from "../components/Layout/ImageCard";

describe("ImageCard", () => {
  it("renders the image with src and alt", () => {
    render(<ImageCard src="https://example.com/photo.jpg" alt="Photo" />);
    const img = screen.getByAltText("Photo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("renders children below image", () => {
    render(
      <ImageCard src="img.jpg">
        <ImageCardBody>Body content</ImageCardBody>
      </ImageCard>,
    );
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<ImageCard src="img.jpg" className="my-image-card" />);
    expect(container.firstChild).toHaveClass("my-image-card");
  });

  it("passes HTML attributes", () => {
    render(<ImageCard src="img.jpg" data-testid="ic" />);
    expect(screen.getByTestId("ic")).toBeInTheDocument();
  });
});

describe("ImageCardBody", () => {
  it("renders children", () => {
    render(<ImageCardBody>Body</ImageCardBody>);
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<ImageCardBody className="extra">B</ImageCardBody>);
    expect(container.firstChild).toHaveClass("extra");
  });
});

describe("ImageCardTitle", () => {
  it("renders as h3", () => {
    render(<ImageCardTitle>Title</ImageCardTitle>);
    expect(screen.getByText("Title").tagName).toBe("H3");
  });
});

describe("ImageCardDescription", () => {
  it("renders as p", () => {
    render(<ImageCardDescription>Desc</ImageCardDescription>);
    expect(screen.getByText("Desc").tagName).toBe("P");
  });
});

describe("ImageCardActions", () => {
  it("renders action buttons", () => {
    render(
      <ImageCardActions>
        <button>Like</button>
        <button>Share</button>
      </ImageCardActions>,
    );
    expect(screen.getByText("Like")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });
});

describe("ImageCard composition", () => {
  it("renders full composition", () => {
    render(
      <ImageCard src="photo.jpg" alt="My photo">
        <ImageCardBody>
          <ImageCardTitle>Sunset</ImageCardTitle>
          <ImageCardDescription>A beautiful sunset</ImageCardDescription>
        </ImageCardBody>
        <ImageCardActions>
          <button>❤️</button>
        </ImageCardActions>
      </ImageCard>,
    );
    expect(screen.getByAltText("My photo")).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();
    expect(screen.getByText("A beautiful sunset")).toBeInTheDocument();
    expect(screen.getByText("❤️")).toBeInTheDocument();
  });
});
