import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilmReel, type FilmReelPhoto } from "../components/Extras/FilmReel";

const photos: FilmReelPhoto[] = [
  { src: "photo1.jpg", alt: "Sunset", title: "Sunset" },
  { src: "photo2.jpg", alt: "Mountain", title: "Mountain", description: "A tall peak" },
  { src: "photo3.jpg", alt: "Ocean" },
];

describe("FilmReel", () => {
  it("renders all photos", () => {
    render(<FilmReel photos={photos} />);
    expect(screen.getByAltText("Sunset")).toBeInTheDocument();
    expect(screen.getByAltText("Mountain")).toBeInTheDocument();
    expect(screen.getByAltText("Ocean")).toBeInTheDocument();
  });

  it("renders in strip layout by default", () => {
    const { container } = render(<FilmReel photos={photos} />);
    // Strip layout renders images
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBe(photos.length);
  });

  it("renders in sheet layout", () => {
    const { container } = render(<FilmReel photos={photos} layout="sheet" />);
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBe(photos.length);
  });

  it("renders in stack layout", () => {
    const { container } = render(<FilmReel photos={photos} layout="stack" />);
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBeGreaterThan(0);
  });

  it("merges custom className", () => {
    const { container } = render(<FilmReel photos={photos} className="my-reel" />);
    expect(container.firstChild).toHaveClass("my-reel");
  });
});
