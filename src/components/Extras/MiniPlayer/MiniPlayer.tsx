import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  ListMusic,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  X,
  Music2,
  Disc3,
  Shuffle,
  Repeat1,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

export interface MiniPlayerTrack {
  /** Display title. */
  title: string;
  /** Artist name. */
  artist?: string;
  /** Album name. */
  album?: string;
  /** URL (http/blob/file) or local path for Electron. */
  src: string;
  /** Album art URL. Omit to show a placeholder. */
  cover?: string;
  /** Duration in seconds (auto-detected if not provided). */
  duration?: number;
}

export type MiniPlayerPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type MiniPlayerEntrance = "bottom" | "top" | "left" | "right";

export interface MiniPlayerProps {
  /** Playlist of tracks. */
  playlist: MiniPlayerTrack[];
  /** Starting track index. @default 0 */
  initialTrack?: number;
  /** Position on screen. @default 'bottom-right' */
  position?: MiniPlayerPosition;
  /** Entrance animation direction. @default derived from position */
  entrance?: MiniPlayerEntrance;
  /** Theme override. Follows parent by default. */
  theme?: "dark" | "light";
  /** When true, player docks to the nearest edge and reveals on hover. @default false */
  docked?: boolean;
  /** When true, player is visible (managed externally or auto-shown on track change). */
  visible?: boolean;
  /** Called when visibility changes internally. */
  onVisibleChange?: (v: boolean) => void;
  /** Called on track change. */
  onTrackChange?: (index: number, track: MiniPlayerTrack) => void;
  /** Called on like toggle. */
  onLike?: (index: number, track: MiniPlayerTrack, liked: boolean) => void;
  /** Auto-play the first track when ready. @default true */
  autoPlay?: boolean;
  /** Initial shuffle state. @default false */
  shuffle?: boolean;
  /** Initial single-track loop state. @default false */
  loop?: boolean;
  /** Accent color (any CSS color value). @default '#8b5cf6' */
  accent?: string;
  /** Extra class name. */
  className?: string;
}

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */

const PLACEHOLDER_COVER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#1e1b2e"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="#6366f1" stroke-width="1.5" opacity="0.3"/>
      <circle cx="100" cy="100" r="20" fill="none" stroke="#6366f1" stroke-width="1" opacity="0.4"/>
      <text x="100" y="108" text-anchor="middle" font-family="monospace" font-size="18" fill="#6366f1" opacity="0.6">♪</text>
    </svg>`,
  );

function fmtTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function defaultEntrance(pos: MiniPlayerPosition): MiniPlayerEntrance {
  if (pos.startsWith("bottom")) return "bottom";
  if (pos.startsWith("top")) return "top";
  return "right";
}

const POSITION_CLASSES: Record<MiniPlayerPosition, string> = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
};

const DOCK_CLASSES: Record<MiniPlayerPosition, string> = {
  "bottom-right": "bottom-4 right-0",
  "bottom-left": "bottom-4 left-0",
  "top-right": "top-4 right-0",
  "top-left": "top-4 left-0",
};

const DOCK_STRIP: Record<MiniPlayerPosition, string> = {
  "bottom-right": "bottom-8 right-0 w-1.5 h-16 rounded-l-full",
  "bottom-left": "bottom-8 left-0 w-1.5 h-16 rounded-r-full",
  "top-right": "top-8 right-0 w-1.5 h-16 rounded-l-full",
  "top-left": "top-8 left-0 w-1.5 h-16 rounded-r-full",
};

/* ═══════════════════════════════════════════════════════════
   MiniPlayer
   ═══════════════════════════════════════════════════════════ */

export function MiniPlayer({
  playlist,
  initialTrack = 0,
  position = "bottom-right",
  entrance: entranceProp,
  theme,
  docked: dockedProp = false,
  visible: visibleProp,
  onVisibleChange,
  onTrackChange,
  onLike,
  autoPlay = true,
  shuffle: shuffleProp = false,
  loop: loopProp = false,
  accent = "#8b5cf6",
  className,
}: MiniPlayerProps) {
  /* ── State ──────────────────────────────── */
  const [currentIndex, setCurrentIndex] = useState(initialTrack);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [internalVisible, setInternalVisible] = useState(visibleProp ?? !dockedProp);
  const [exiting, setExiting] = useState(false);
  const [dockHover, setDockHover] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(shuffleProp);
  const [loopOn, setLoopOn] = useState(loopProp);
  const autoPlayedRef = useRef(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const visible = visibleProp ?? internalVisible;
  const entrance = entranceProp ?? defaultEntrance(position);
  const track = playlist[currentIndex];
  const docked = dockedProp && !dockHover;
  const isDockedMode = dockedProp;

  /* ── Theme classes ──────────────────────── */
  const themeClass = theme === "dark" ? "dark" : theme === "light" ? "light" : "";

  const bg = "bg-(--mp-bg)";
  const text = "text-(--mp-text)";
  const textSub = "text-(--mp-text-muted)";
  const accentCls = "text-(--accent)";
  const border = "border-(--mp-border)";

  /* ── Audio control ──────────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    audio.load();
    if (playing) {
      audio.play().catch(() => {});
    }
  }, [currentIndex, track.src]);

  /* ── Auto-play on first canplaythrough ─── */
  useEffect(() => {
    if (!autoPlay || autoPlayedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    const onCanPlay = () => {
      autoPlayedRef.current = true;
      setPlaying(true);
      audio.play().catch(() => {});
    };
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });
    return () => audio.removeEventListener("canplaythrough", onCanPlay);
  }, [autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onDur = () => setDuration(audio.duration);
    const onEnd = () => {
      if (loopOn) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        skipNext();
      }
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("ended", onEnd);
    };
  }, [currentIndex, playlist.length]);

  /* ── Track navigation ───────────────────── */
  const goToTrack = useCallback(
    (idx: number) => {
      const i = ((idx % playlist.length) + playlist.length) % playlist.length;
      setCurrentIndex(i);
      setProgress(0);
      onTrackChange?.(i, playlist[i]);
      // Auto-show on track change
      if (!visible) {
        setInternalVisible(true);
        onVisibleChange?.(true);
      }
    },
    [playlist, visible, onTrackChange, onVisibleChange],
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

  const toggleLike = useCallback(() => {
    const isLiked = liked.has(currentIndex);
    setLiked((prev) => {
      const next = new Set(prev);
      if (isLiked) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
    onLike?.(currentIndex, track, !isLiked);
  }, [currentIndex, liked, onLike, track]);

  /* ── Seek ───────────────────────────────── */
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = ratio * duration;
      if (audioRef.current) audioRef.current.currentTime = newTime;
      setProgress(newTime);
    },
    [duration],
  );

  /* ── Visibility / animation ─────────────── */
  const hide = useCallback(() => {
    setExiting(true);
    const dur = isDockedMode ? 200 : 400;
    animTimerRef.current = setTimeout(() => {
      setExiting(false);
      setInternalVisible(false);
      onVisibleChange?.(false);
    }, dur);
  }, [isDockedMode, onVisibleChange]);

  useEffect(
    () => () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    },
    [],
  );

  /* ── Animations ─────────────────────────── */
  const enterAnim = dockHover
    ? "fade-in 0.2s ease-out both"
    : `mp-enter-${entrance} 0.45s cubic-bezier(0.16, 1, 0.3, 1) both`;
  const exitAnim = dockHover
    ? "fade-in 0.2s ease-in reverse both"
    : `mp-exit-${entrance} 0.4s cubic-bezier(0.7, 0, 0.84, 0) both`;

  /* ── Progress ratio ─────────────────────── */
  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  /* ── Dock strip (when docked & hidden) ──── */
  if (isDockedMode && !visible && !exiting) {
    return (
      <>
        <audio ref={audioRef} preload="metadata" />
        <div
          className={cn(
            "fixed z-100 cursor-pointer transition-all duration-300",
            DOCK_STRIP[position],
          )}
          style={{ "--accent": accent } as React.CSSProperties}
          onMouseEnter={() => {
            setDockHover(true);
            setInternalVisible(true);
            onVisibleChange?.(true);
          }}
        >
          {/* Glowing strip */}
          <div
            className={cn(
              "h-full w-full rounded-full",
              playing ? "bg-(--accent)" : "bg-(--mp-dock-strip)",
            )}
            style={
              playing
                ? {
                    animation: "mp-progress-glow 2s ease-in-out infinite",
                    boxShadow: `0 0 12px color-mix(in srgb, var(--accent) 50%, transparent)`,
                  }
                : undefined
            }
          />
          {/* Pulse ring when playing */}
          {playing && (
            <div
              className="absolute inset-0 rounded-full bg-(--accent)/30"
              style={{ animation: "mp-pulse-ring 2s ease-out infinite" }}
            />
          )}
        </div>
      </>
    );
  }

  if (!visible && !exiting) {
    return <audio ref={audioRef} preload="metadata" />;
  }

  /* ── Main player ────────────────────────── */
  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      <div
        className={cn(
          "fixed z-100",
          isDockedMode ? DOCK_CLASSES[position] : POSITION_CLASSES[position],
          themeClass,
        )}
        style={
          {
            "--accent": accent,
            ...(exiting ? { animation: exitAnim } : { animation: enterAnim }),
          } as React.CSSProperties
        }
        onMouseEnter={() => {
          if (isDockedMode) {
            // Cancel any pending hide when mouse re-enters
            if (animTimerRef.current) {
              clearTimeout(animTimerRef.current);
              animTimerRef.current = undefined;
            }
            if (exiting) setExiting(false);
            setDockHover(true);
          }
        }}
        onMouseLeave={() => {
          if (isDockedMode) {
            setDockHover(false);
            hide();
          }
        }}
      >
        <div
          className={cn(
            "w-[320px] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl",
            bg,
            border,
            isDockedMode && "rounded-none",
            position.endsWith("right") && isDockedMode && "rounded-l-2xl",
            position.endsWith("left") && isDockedMode && "rounded-r-2xl",
            className,
          )}
        >
          {/* ── Album art + info ─────────── */}
          <div className="relative">
            {/* Cover background (blurred) */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={track.cover || PLACEHOLDER_COVER}
                alt=""
                className="h-full w-full scale-110 object-cover opacity-30 blur-2xl"
                draggable={false}
              />
            </div>

            <div className="relative flex items-center gap-3.5 p-4 pb-3">
              {/* Vinyl/cover disc */}
              <div className="relative h-14 w-14 shrink-0">
                <div
                  className="h-14 w-14 overflow-hidden rounded-full border-2 border-white/10 shadow-lg"
                  style={playing ? { animation: "mp-vinyl-spin 4s linear infinite" } : undefined}
                >
                  <img
                    src={track.cover || PLACEHOLDER_COVER}
                    alt={track.album ?? track.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  {/* Vinyl center hole */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-black/60 ring-1 ring-white/10" />
                  </div>
                </div>
                {/* Pulse behind disc when playing */}
                {playing && (
                  <div
                    className="absolute inset-0 rounded-full bg-(--accent)/20"
                    style={{ animation: "mp-pulse-ring 2.5s ease-out infinite" }}
                  />
                )}
              </div>

              {/* Track info */}
              <div className="min-w-0 flex-1">
                <div className={cn("truncate text-sm font-semibold", text)}>{track.title}</div>
                {track.artist && (
                  <div className={cn("truncate text-xs", textSub)}>{track.artist}</div>
                )}
                {track.album && (
                  <div
                    className={cn(
                      "mt-0.5 truncate text-[10px] tracking-wide",
                      textSub,
                      "opacity-60",
                    )}
                  >
                    {track.album}
                  </div>
                )}
              </div>

              {/* Action buttons (top-right) */}
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  className={cn(
                    "rounded-full p-1.5 transition-all duration-200",
                    liked.has(currentIndex)
                      ? "text-rose-500 hover:text-rose-400"
                      : cn(textSub, "hover:text-rose-500"),
                  )}
                  onClick={toggleLike}
                  title="Like"
                >
                  <Heart
                    className="h-4 w-4"
                    fill={liked.has(currentIndex) ? "currentColor" : "none"}
                  />
                </button>
                <button
                  className={cn(
                    "rounded-full p-1.5 transition-colors",
                    textSub,
                    "hover:" + text.split(" ")[0],
                  )}
                  onClick={() => setShowPlaylist((v) => !v)}
                  title="Playlist"
                >
                  <ListMusic className="h-4 w-4" />
                </button>
                {!isDockedMode && (
                  <button
                    className={cn(
                      "rounded-full p-1.5 transition-colors",
                      textSub,
                      "hover:" + text.split(" ")[0],
                    )}
                    onClick={hide}
                    title="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Progress bar ─────────────── */}
          <div className="px-4">
            <div
              ref={progressRef}
              className="group relative h-1.5 cursor-pointer rounded-full bg-(--mp-surface)"
              onClick={handleSeek}
            >
              <div
                className="h-full rounded-full bg-(--accent) transition-[width] duration-150"
                style={{ width: `${pct}%` }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-(--accent) opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                style={{ left: `calc(${pct}% - 6px)` }}
              />
            </div>
            <div className={cn("mt-1 flex justify-between text-[10px] font-mono", textSub)}>
              <span>{fmtTime(progress)}</span>
              <span>{fmtTime(duration)}</span>
            </div>
          </div>

          {/* ── Controls ─────────────────── */}
          <div className="flex items-center justify-center gap-2 px-4 pb-3 pt-1">
            <button
              className={cn(
                "rounded-full p-1.5 transition-colors",
                shuffleOn ? accentCls : textSub,
                "hover:text-(--mp-text)",
              )}
              onClick={() => setShuffleOn((s) => !s)}
              title={shuffleOn ? "Shuffle On" : "Shuffle Off"}
            >
              <Shuffle className="h-3.5 w-3.5" />
            </button>

            <button
              className={cn(
                "rounded-full p-1.5 transition-colors",
                loopOn ? accentCls : textSub,
                "hover:text-(--mp-text)",
              )}
              onClick={() => setLoopOn((l) => !l)}
              title={loopOn ? "Loop On" : "Loop Off"}
            >
              <Repeat1 className="h-3.5 w-3.5" />
            </button>

            <button
              className={cn(
                "rounded-full p-2 transition-colors",
                textSub,
                "hover:text-(--mp-text)",
              )}
              onClick={skipPrev}
              title="Previous"
            >
              <SkipBack className="h-4 w-4" fill="currentColor" />
            </button>

            <button
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                "bg-(--accent) text-white shadow-lg active:scale-95",
              )}
              style={{ boxShadow: `0 6px 20px color-mix(in srgb, var(--accent) 35%, transparent)` }}
              onClick={() => setPlaying((p) => !p)}
              title={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="h-4.5 w-4.5" fill="currentColor" />
              ) : (
                <Play className="h-4.5 w-4.5 translate-x-px" fill="currentColor" />
              )}
            </button>

            <button
              className={cn(
                "rounded-full p-2 transition-colors",
                textSub,
                "hover:text-(--mp-text)",
              )}
              onClick={skipNext}
              title="Next"
            >
              <SkipForward className="h-4 w-4" fill="currentColor" />
            </button>

            {/* Volume */}
            <div className="ml-2 flex items-center gap-1.5">
              <button
                className={cn(
                  "rounded-full p-1 transition-colors",
                  textSub,
                  "hover:text-(--mp-text)",
                )}
                onClick={() => setMuted((m) => !m)}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </button>
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
                className="mp-volume-slider h-1 w-14 cursor-pointer appearance-none rounded-full bg-(--mp-surface) accent-(--accent)"
              />
            </div>
          </div>

          {/* ── Playlist (expandable) ────── */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              showPlaylist ? "max-h-60" : "max-h-0",
            )}
          >
            <div className={cn("border-t px-2 py-2", border)}>
              <div className="max-h-52 space-y-0.5 overflow-y-auto">
                {playlist.map((t, i) => {
                  const isCurrent = i === currentIndex;
                  return (
                    <button
                      key={i}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-200",
                        isCurrent
                          ? "bg-(--accent)/10 dark:bg-(--accent)/15"
                          : "hover:bg-(--mp-surface-hover)",
                      )}
                      onClick={() => {
                        goToTrack(i);
                        setPlaying(true);
                      }}
                    >
                      {/* Track number / playing indicator */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        {isCurrent && playing ? (
                          <div className="flex items-end gap-0.5">
                            {[1, 2, 3].map((b) => (
                              <div
                                key={b}
                                className="w-0.75 rounded-full bg-(--accent)"
                                style={{
                                  height: `${8 + b * 4}px`,
                                  animation: `mp-eq-bar ${0.4 + b * 0.15}s ease-in-out infinite alternate`,
                                }}
                              />
                            ))}
                          </div>
                        ) : isCurrent ? (
                          <Disc3 className={cn("h-4 w-4", accentCls)} />
                        ) : (
                          <span className={cn("text-xs font-mono", textSub)}>{i + 1}</span>
                        )}
                      </div>
                      {/* Mini cover */}
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded">
                        <img
                          src={t.cover || PLACEHOLDER_COVER}
                          alt=""
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      </div>
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            "truncate text-xs font-medium",
                            isCurrent ? accentCls : text,
                          )}
                        >
                          {t.title}
                        </div>
                        {t.artist && (
                          <div className={cn("truncate text-[10px]", textSub)}>{t.artist}</div>
                        )}
                      </div>
                      {/* Like badge */}
                      {liked.has(i) && (
                        <Heart className="h-3 w-3 shrink-0 text-rose-500" fill="currentColor" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
