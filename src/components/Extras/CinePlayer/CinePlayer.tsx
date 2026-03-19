import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat1,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  ListVideo,
  Theater,
  ArrowUpDown,
  X,
  ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

export interface CinePlayerMedia {
  /** Display title. */
  title: string;
  /** Subtitle / description line. */
  subtitle?: string;
  /** Media type tag (e.g. 'movie', 'clip', 'episode'). Used for sorting. */
  type?: string;
  /** Source URL (http/blob/file). */
  src: string;
  /** Poster / thumbnail URL. */
  poster?: string;
  /** Duration in seconds (auto-detected if omitted). */
  duration?: number;
}

export type CinePlayerSortKey = "title" | "type" | "duration";

export interface CinePlayerProps {
  /** Media playlist. */
  playlist: CinePlayerMedia[];
  /** Starting index. @default 0 */
  initialTrack?: number;
  /** Auto-play when ready. @default false */
  autoPlay?: boolean;
  /** Initial shuffle state. @default false */
  shuffle?: boolean;
  /** Initial loop state. @default false */
  loop?: boolean;
  /** Called on track change. */
  onTrackChange?: (index: number, media: CinePlayerMedia) => void;
  /** Called when play state changes. */
  onPlayChange?: (playing: boolean) => void;
  /** Accent color (any CSS color value). @default '#8b5cf6' */
  accent?: string;
  /** Extra class name on root. */
  className?: string;
}

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */

function fmtTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* Sort comparators */
const SORT_FNS: Record<CinePlayerSortKey, (a: CinePlayerMedia, b: CinePlayerMedia) => number> = {
  title: (a, b) => a.title.localeCompare(b.title),
  type: (a, b) => (a.type ?? "").localeCompare(b.type ?? ""),
  duration: (a, b) => (a.duration ?? 0) - (b.duration ?? 0),
};

/* ═══════════════════════════════════════════════════════════
   CinePlayer
   ═══════════════════════════════════════════════════════════ */

export function CinePlayer({
  playlist,
  initialTrack = 0,
  autoPlay = false,
  shuffle: shuffleProp = false,
  loop: loopProp = false,
  onTrackChange,
  onPlayChange,
  accent = "#8b5cf6",
  className,
}: CinePlayerProps) {
  /* ── State ────────────────────────────────── */
  const [currentIndex, setCurrentIndex] = useState(initialTrack);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(shuffleProp);
  const [loopOn, setLoopOn] = useState(loopProp);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [sortKey, setSortKey] = useState<CinePlayerSortKey>("title");
  const [sortAsc, setSortAsc] = useState(true);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [cinemaExiting, setCinemaExiting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [seekHover, setSeekHover] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const autoPlayedRef = useRef(false);

  const track = playlist[currentIndex];

  /* ── Sorted playlist for the panel ──────── */
  const sortedPlaylist = React.useMemo(() => {
    const indexed = playlist.map((m, i) => ({ media: m, originalIndex: i }));
    indexed.sort((a, b) => {
      const cmp = SORT_FNS[sortKey](a.media, b.media);
      return sortAsc ? cmp : -cmp;
    });
    return indexed;
  }, [playlist, sortKey, sortAsc]);

  /* ── Video source management ────────────── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setTransitioning(true);
    v.src = track.src;
    if (track.poster) v.poster = track.poster;
    v.load();
    const onLoaded = () => {
      setTransitioning(false);
      if (playing) v.play().catch(() => {});
    };
    v.addEventListener("loadeddata", onLoaded, { once: true });
    return () => v.removeEventListener("loadeddata", onLoaded);
  }, [currentIndex, track.src]);

  /* ── Auto-play ──────────────────────────── */
  useEffect(() => {
    if (!autoPlay || autoPlayedRef.current) return;
    const v = videoRef.current;
    if (!v) return;
    const onCan = () => {
      autoPlayedRef.current = true;
      setPlaying(true);
      v.play().catch(() => {});
    };
    v.addEventListener("canplaythrough", onCan, { once: true });
    return () => v.removeEventListener("canplaythrough", onCan);
  }, [autoPlay]);

  /* ── Play / Pause sync ─────────────────── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
    onPlayChange?.(playing);
  }, [playing]);

  /* ── Volume sync ────────────────────────── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = muted ? 0 : volume;
  }, [volume, muted]);

  /* ── Time / buffered / ended ────────────── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress(v.currentTime);
    const onDur = () => setDuration(v.duration);
    const onProgress = () => {
      if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1));
    };
    const onEnd = () => {
      if (loopOn) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        skipNext();
      }
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onDur);
    v.addEventListener("progress", onProgress);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onDur);
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("ended", onEnd);
    };
  }, [currentIndex, playlist.length, loopOn]);

  /* ── Controls auto-hide ─────────────────── */
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (playing) setControlsVisible(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    if (!playing) {
      setControlsVisible(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    } else {
      showControls();
    }
  }, [playing, showControls]);

  useEffect(
    () => () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    },
    [],
  );

  /* ── Navigation ─────────────────────────── */
  const goToTrack = useCallback(
    (idx: number) => {
      const i = ((idx % playlist.length) + playlist.length) % playlist.length;
      setCurrentIndex(i);
      setProgress(0);
      setPlaying(true);
      onTrackChange?.(i, playlist[i]);
    },
    [playlist, onTrackChange],
  );

  const skipNext = useCallback(() => {
    if (shuffleOn) {
      let r: number;
      do {
        r = Math.floor(Math.random() * playlist.length);
      } while (r === currentIndex && playlist.length > 1);
      goToTrack(r);
    } else {
      goToTrack(currentIndex + 1);
    }
  }, [goToTrack, currentIndex, shuffleOn, playlist.length]);

  const skipPrev = useCallback(() => {
    if (shuffleOn) {
      let r: number;
      do {
        r = Math.floor(Math.random() * playlist.length);
      } while (r === currentIndex && playlist.length > 1);
      goToTrack(r);
    } else {
      goToTrack(currentIndex - 1);
    }
  }, [goToTrack, currentIndex, shuffleOn, playlist.length]);

  /* ── Seek ───────────────────────────────── */
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = ratio * duration;
      if (videoRef.current) videoRef.current.currentTime = newTime;
      setProgress(newTime);
    },
    [duration],
  );

  const handleSeekHover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setSeekHover(ratio * duration);
    },
    [duration],
  );

  /* ── Fullscreen ─────────────────────────── */
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* ── Cinema mode ────────────────────────── */
  const toggleCinema = useCallback(() => {
    if (cinemaMode) {
      setCinemaExiting(true);
      setTimeout(() => {
        setCinemaMode(false);
        setCinemaExiting(false);
      }, 500);
    } else {
      setCinemaMode(true);
    }
  }, [cinemaMode]);

  /* ── Playlist panel ─────────────────────── */
  const togglePlaylist = useCallback(() => {
    setShowPlaylist((p) => !p);
  }, []);

  /* ── Sort cycling ───────────────────────── */
  const cycleSort = useCallback(() => {
    const keys: CinePlayerSortKey[] = ["title", "type", "duration"];
    const idx = keys.indexOf(sortKey);
    if (sortAsc) {
      setSortAsc(false);
    } else {
      setSortAsc(true);
      setSortKey(keys[(idx + 1) % keys.length]);
    }
  }, [sortKey, sortAsc]);

  /* ── Keyboard ───────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "t":
          e.preventDefault();
          toggleCinema();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (videoRef.current) videoRef.current.currentTime = Math.max(0, progress - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (videoRef.current) videoRef.current.currentTime = Math.min(duration, progress + 5);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.05));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.05));
          break;
        case "Escape":
          if (cinemaMode) toggleCinema();
          break;
        case "n":
          e.preventDefault();
          skipNext();
          break;
        case "p":
          e.preventDefault();
          skipPrev();
          break;
        case "l":
          e.preventDefault();
          togglePlaylist();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    toggleFullscreen,
    toggleCinema,
    togglePlaylist,
    skipNext,
    skipPrev,
    progress,
    duration,
    cinemaMode,
  ]);

  /* ── Progress ratio ─────────────────────── */
  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const bufPct = duration > 0 ? (buffered / duration) * 100 : 0;

  /* ── Accent helpers ─────────────────────── */
  const accentOn = "text-(--accent)";

  /* ═══════════════════════════════════════════
     Render
     ═══════════════════════════════════════════ */

  const playerContent = (
    <div
      ref={containerRef}
      className={cn(
        "group flex overflow-hidden",
        isFullscreen ? "h-full w-full" : "aspect-video w-full",
        !isFullscreen && "rounded-xl",
        !isFullscreen && playing && "shadow-2xl",
        !isFullscreen &&
          !playing &&
          "animate-[cp-glow-pulse_4s_ease-in-out_infinite] will-change-[box-shadow]",
        className,
      )}
      style={{ "--accent": accent, background: "var(--cp-bg)" } as React.CSSProperties}
      tabIndex={0}
    >
      {/* ── Video area ─────────────────── */}
      <div
        className={cn(
          "relative flex-1 min-w-0 h-full overflow-hidden",
          transitioning && "animate-[cp-track-transition_0.6s_ease-out]",
        )}
        onMouseMove={showControls}
        onMouseLeave={() => {
          if (playing) setControlsVisible(false);
        }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          poster={track.poster}
          playsInline
          preload="metadata"
          onClick={() => setPlaying((p) => !p)}
        />

        {/* ── Big play button (paused overlay) */}
        {!playing && !transitioning && (
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
            style={{ background: "var(--cp-overlay)" }}
            onClick={() => setPlaying(true)}
          >
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
              style={{ background: "var(--cp-surface-hover)" }}
            >
              <Play
                className="h-10 w-10 translate-x-0.5"
                fill="currentColor"
                style={{ color: "var(--cp-text-strong)" }}
              />
            </div>
          </div>
        )}

        {/* ── Track title toast ──────────── */}
        {transitioning && (
          <div className="absolute left-6 top-6 z-20 animate-[fade-in_0.4s_ease-out]">
            <div
              className="rounded-lg px-4 py-2 backdrop-blur-md"
              style={{ background: "var(--cp-panel-bg)" }}
            >
              <div className="text-sm font-semibold" style={{ color: "var(--cp-text-strong)" }}>
                {track.title}
              </div>
              {track.subtitle && (
                <div className="text-xs" style={{ color: "var(--cp-text-muted)" }}>
                  {track.subtitle}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Title bar (top gradient) ───── */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 z-10 bg-linear-to-b from-black/70 to-transparent px-5 pb-8 pt-4 transition-opacity duration-500",
            controlsVisible ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-sm font-semibold drop-shadow-md"
                style={{ color: "var(--cp-text-strong)" }}
              >
                {track.title}
              </h3>
              {track.subtitle && (
                <p className="text-xs" style={{ color: "var(--cp-text-muted)" }}>
                  {track.subtitle}
                </p>
              )}
            </div>
            {track.type && (
              <span
                className="rounded-full bg-(--accent)/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
                style={{ color: "var(--cp-text-strong)" }}
              >
                {track.type}
              </span>
            )}
          </div>
        </div>

        {/* ── Controls bar (bottom) ──────── */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-10 transition-all duration-500",
            controlsVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0",
          )}
        >
          {/* Seek bar */}
          <div
            className="group/seek relative mb-3 h-1 cursor-pointer rounded-full transition-[height] duration-200 hover:h-1.5"
            style={{ background: "var(--cp-seek-track)" }}
            onClick={handleSeek}
            onMouseMove={handleSeekHover}
            onMouseLeave={() => setSeekHover(null)}
          >
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${bufPct}%`, background: "var(--cp-seek-buffer)" }}
            />
            {/* Progress */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-(--accent) transition-[width] duration-100"
              style={{ width: `${pct}%` }}
            />
            {/* Hover preview time */}
            {seekHover !== null && (
              <div
                className="absolute -top-8 -translate-x-1/2 rounded px-2 py-0.5 text-[10px] font-mono"
                style={{
                  left: `${(seekHover / duration) * 100}%`,
                  background: "var(--cp-panel-bg)",
                  color: "var(--cp-text-strong)",
                }}
              >
                {fmtTime(seekHover)}
              </div>
            )}
            {/* Thumb */}
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-(--accent) bg-white opacity-0 shadow-lg transition-opacity group-hover/seek:opacity-100"
              style={{ left: `calc(${pct}% - 7px)` }}
            />
          </div>

          {/* Buttons row */}
          <div className="flex items-center gap-1">
            {/* Left: playback controls */}
            <button
              className="cp-btn"
              onClick={() => setPlaying((p) => !p)}
              title={playing ? "Pause (k)" : "Play (k)"}
            >
              {playing ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="h-5 w-5 translate-x-px" fill="currentColor" />
              )}
            </button>
            <button className="cp-btn" onClick={skipPrev} title="Previous (p)">
              <SkipBack className="h-4 w-4" fill="currentColor" />
            </button>
            <button className="cp-btn" onClick={skipNext} title="Next (n)">
              <SkipForward className="h-4 w-4" fill="currentColor" />
            </button>

            {/* Volume */}
            <div className="group/vol ml-1 flex items-center">
              <button
                className="cp-btn"
                onClick={() => setMuted((m) => !m)}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <div className="flex w-0 items-center overflow-hidden transition-all duration-300 group-hover/vol:w-20">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    if (muted) setMuted(false);
                  }}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full accent-(--accent)"
                  style={{ background: "var(--cp-seek-track)" }}
                />
              </div>
            </div>

            {/* Time */}
            <span
              className="ml-2 min-w-0 shrink-0 font-mono text-xs"
              style={{ color: "var(--cp-text-muted)" }}
            >
              {fmtTime(progress)} / {fmtTime(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right: mode controls */}
            <button
              className={cn("cp-btn", shuffleOn && accentOn)}
              onClick={() => setShuffleOn((s) => !s)}
              title="Shuffle"
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              className={cn("cp-btn", loopOn && accentOn)}
              onClick={() => setLoopOn((l) => !l)}
              title="Loop"
            >
              <Repeat1 className="h-4 w-4" />
            </button>
            <button
              className={cn("cp-btn", showPlaylist && accentOn)}
              onClick={togglePlaylist}
              title="Playlist"
            >
              <ListVideo className="h-4 w-4" />
            </button>
            <button
              className={cn("cp-btn", cinemaMode && accentOn)}
              onClick={toggleCinema}
              title="Cinema mode (t)"
            >
              <Theater className="h-4 w-4" />
            </button>
            <button className="cp-btn" onClick={toggleFullscreen} title="Fullscreen (f)">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      {/* end video area */}

      {/* ── Playlist panel (right side) ── */}
      <div
        className={cn(
          "h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out",
          showPlaylist ? "w-72" : "w-0",
        )}
      >
        <div
          className="flex h-full w-72 flex-col backdrop-blur-xl"
          style={{ borderLeft: `1px solid var(--cp-border)`, background: "var(--cp-panel-bg)" }}
        >
          {/* Playlist header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid var(--cp-border)` }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--cp-text)" }}
            >
              Playlist
            </span>
            <div className="flex items-center gap-1">
              <button
                className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium transition-colors"
                style={{ color: "var(--cp-text-muted)" }}
                onClick={cycleSort}
                title={`Sort: ${sortKey} ${sortAsc ? "↑" : "↓"}`}
              >
                <ArrowUpDown className="h-3 w-3" />
                {sortKey}
                {sortAsc ? " ↑" : " ↓"}
              </button>
              <button className="cp-btn p-1!" onClick={togglePlaylist} title="Close">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Playlist items */}
          <div className="flex-1 overflow-y-auto">
            {sortedPlaylist.map(({ media, originalIndex }) => {
              const isCurrent = originalIndex === currentIndex;
              return (
                <button
                  key={originalIndex}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all duration-200",
                    isCurrent
                      ? "bg-(--accent)/20 text-(--accent)"
                      : "hover:text-(--cp-text-strong)",
                  )}
                  style={!isCurrent ? { color: "var(--cp-text)" } : undefined}
                  onClick={() => {
                    goToTrack(originalIndex);
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-10 w-16 shrink-0 overflow-hidden rounded"
                    style={{ background: "var(--cp-surface)" }}
                  >
                    {media.poster ? (
                      <img
                        src={media.poster}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Play className="h-4 w-4" style={{ color: "var(--cp-seek-track)" }} />
                      </div>
                    )}
                    {isCurrent && playing && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "var(--cp-overlay)" }}
                      >
                        <div className="flex items-end gap-px">
                          {[1, 2, 3, 4].map((b) => (
                            <div
                              key={b}
                              className="w-0.5 rounded-full bg-(--accent)"
                              style={{
                                height: `${6 + b * 3}px`,
                                animation: `mp-eq-bar ${0.3 + b * 0.12}s ease-in-out infinite alternate`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{media.title}</div>
                    <div className="flex items-center gap-2">
                      {media.type && (
                        <span className="text-[10px] uppercase tracking-wide opacity-50">
                          {media.type}
                        </span>
                      )}
                      {media.duration != null && (
                        <span className="font-mono text-[10px] opacity-40">
                          {fmtTime(media.duration)}
                        </span>
                      )}
                    </div>
                  </div>

                  {isCurrent && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-(--accent)" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inline styles for cp-btn utility – scoped to this component's container */}
      <style>{`
        .cp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 9999px;
          color: var(--cp-text);
          transition: color 0.15s, background 0.15s, transform 0.15s;
        }
        .cp-btn:hover { color: var(--cp-text-strong); background: var(--cp-surface-hover); }
        .cp-btn:active { transform: scale(0.9); }
        @keyframes cp-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 25%, transparent), 0 25px 50px -12px rgba(0,0,0,0.25); }
          50%      { box-shadow: 0 0 40px color-mix(in srgb, var(--accent) 55%, transparent), 0 25px 50px -12px rgba(0,0,0,0.25); }
        }
      `}</style>
    </div>
  );

  /* ── Always render the same tree so <video> is never unmounted ── */
  return (
    <div
      className={cn(
        cinemaMode && "fixed inset-0 z-100 flex items-center justify-center p-8",
        cinemaMode &&
          (cinemaExiting
            ? "animate-[cp-cinema-out_0.5s_ease-in_both]"
            : "animate-[cp-cinema-in_0.5s_ease-out_both]"),
      )}
      onClick={
        cinemaMode
          ? (e: React.MouseEvent) => {
              if (e.target === e.currentTarget) toggleCinema();
            }
          : undefined
      }
    >
      <div className={cn(cinemaMode && "w-full", cinemaMode && !isFullscreen && "max-w-5xl")}>
        {playerContent}
      </div>
    </div>
  );
}
