import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MiniPlayer, type MiniPlayerTrack } from "../components/Extras/MiniPlayer";

const playlist: MiniPlayerTrack[] = [
  { title: "Song A", artist: "Artist 1", src: "song1.mp3", cover: "cover1.jpg" },
  { title: "Song B", artist: "Artist 2", src: "song2.mp3" },
  { title: "Song C", src: "song3.mp3", album: "Album X", duration: 180 },
];

beforeEach(() => {
  HTMLAudioElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLAudioElement.prototype.pause = vi.fn();
  HTMLAudioElement.prototype.load = vi.fn();
});

describe("MiniPlayer", () => {
  it("renders the current track title", () => {
    render(<MiniPlayer playlist={playlist} autoPlay={false} />);
    const matches = screen.getAllByText("Song A");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the artist name", () => {
    render(<MiniPlayer playlist={playlist} autoPlay={false} />);
    const matches = screen.getAllByText("Artist 1");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("starts at initialTrack", () => {
    render(<MiniPlayer playlist={playlist} initialTrack={1} autoPlay={false} />);
    const matches = screen.getAllByText("Song B");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders an audio element", () => {
    const { container } = render(<MiniPlayer playlist={playlist} autoPlay={false} />);
    expect(container.querySelector("audio")).toBeTruthy();
  });

  it("renders playback control buttons", () => {
    const { container } = render(<MiniPlayer playlist={playlist} autoPlay={false} />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <MiniPlayer playlist={playlist} autoPlay={false} className="my-mini" />,
    );
    expect(container.querySelector(".my-mini")).toBeTruthy();
  });
});
