import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CinePlayer, type CinePlayerMedia } from "../components/CinePlayer";

const playlist: CinePlayerMedia[] = [
  { title: "Track 1", subtitle: "First clip", src: "video1.mp4", poster: "poster1.jpg" },
  { title: "Track 2", subtitle: "Second clip", src: "video2.mp4" },
  { title: "Track 3", src: "video3.mp4", type: "movie", duration: 120 },
];

beforeEach(() => {
  // Stub video element methods since jsdom doesn't support them
  HTMLVideoElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLVideoElement.prototype.pause = vi.fn();
  HTMLVideoElement.prototype.load = vi.fn();
});

describe("CinePlayer", () => {
  it("renders a video element", () => {
    const { container } = render(<CinePlayer playlist={playlist} />);
    expect(container.querySelector("video")).toBeTruthy();
  });

  it("renders the current track title", () => {
    render(<CinePlayer playlist={playlist} />);
    const matches = screen.getAllByText("Track 1");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders subtitle when present", () => {
    render(<CinePlayer playlist={playlist} />);
    const matches = screen.getAllByText("First clip");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("starts at specified initialTrack", () => {
    render(<CinePlayer playlist={playlist} initialTrack={1} />);
    const matches = screen.getAllByText("Track 2");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("applies custom className", () => {
    const { container } = render(<CinePlayer playlist={playlist} className="my-player" />);
    // className is applied to a nested wrapper, not the root
    expect(container.querySelector(".my-player")).toBeTruthy();
  });

  it("renders play controls", () => {
    const { container } = render(<CinePlayer playlist={playlist} />);
    // Should have buttons for play, skip, etc.
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
