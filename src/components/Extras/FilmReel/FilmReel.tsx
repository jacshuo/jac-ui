import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/utils";
import {
  Heart,
  ThumbsDown,
  Bookmark,
  Share2,
  Download,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  MapPin,
  Calendar,
  Aperture,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

export interface FilmReelPhoto {
  src: string;
  alt?: string;
  title?: string;
  /** A short memoir or description for this photo. */
  description?: string;
  metadata?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
    date?: string;
    location?: string;
    [key: string]: string | undefined;
  };
}

export interface FilmReelAction {
  key: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  toggle?: boolean;
}

export type FilmReelLayout = "strip" | "sheet" | "stack";

export interface FilmReelProps {
  photos: FilmReelPhoto[];
  layout?: FilmReelLayout;
  actions?: FilmReelAction[];
  onAction?: (action: string, photo: FilmReelPhoto, index: number) => void;
  className?: string;
  showGrain?: boolean;
  /** Left-side header text for the contact sheet layout. */
  sheetTitle?: string;
  /** Right-side label text for the contact sheet layout. */
  sheetLabel?: string;
}

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */

const FILM_BASE = "#1c1914";
const FILM_DARK = "#130f0b";
const SPROCKET_COLOR = "#2e261e";
const FRAME_BORDER = "#504638";
const FRAME_NUM_COLOR = "#6b5d4d";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const DEFAULT_ACTIONS: FilmReelAction[] = [
  {
    key: "like",
    icon: <Heart className="h-5 w-5" />,
    activeIcon: <Heart className="h-5 w-5" fill="currentColor" />,
    label: "Like",
    toggle: true,
  },
  { key: "dislike", icon: <ThumbsDown className="h-5 w-5" />, label: "Dislike" },
  {
    key: "bookmark",
    icon: <Bookmark className="h-5 w-5" />,
    activeIcon: <Bookmark className="h-5 w-5" fill="currentColor" />,
    label: "Bookmark",
    toggle: true,
  },
  { key: "share", icon: <Share2 className="h-5 w-5" />, label: "Share" },
  { key: "download", icon: <Download className="h-5 w-5" />, label: "Download" },
];

/* ═══════════════════════════════════════════════════════════
   FilmReel — main entry
   ═══════════════════════════════════════════════════════════ */

export function FilmReel({
  photos,
  layout = "strip",
  actions = DEFAULT_ACTIONS,
  onAction,
  className,
  showGrain = true,
  sheetTitle,
  sheetLabel,
}: FilmReelProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeActions, setActiveActions] = useState<Set<string>>(new Set());

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const handleAction = useCallback(
    (key: string, index: number) => {
      const action = actions.find((a) => a.key === key);
      if (action?.toggle) {
        const id = `${index}-${key}`;
        setActiveActions((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
      }
      onAction?.(key, photos[index], index);
    },
    [actions, onAction, photos],
  );

  const Layout = layout === "strip" ? StripLayout : layout === "sheet" ? SheetLayout : StackLayout;

  return (
    <>
      <Layout
        photos={photos}
        onPhotoClick={openLightbox}
        showGrain={showGrain}
        className={className}
        sheetTitle={sheetTitle}
        sheetLabel={sheetLabel}
      />
      {lightboxIndex !== null &&
        createPortal(
          <Lightbox
            photos={photos}
            currentIndex={lightboxIndex}
            onIndexChange={setLightboxIndex}
            onClose={closeLightbox}
            actions={actions}
            activeActions={activeActions}
            onAction={handleAction}
            showGrain={showGrain}
          />,
          document.body,
        )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Layout props
   ═══════════════════════════════════════════════════════════ */

interface LayoutProps {
  photos: FilmReelPhoto[];
  onPhotoClick: (index: number) => void;
  showGrain: boolean;
  className?: string;
  sheetTitle?: string;
  sheetLabel?: string;
}

/* ═══════════════════════════════════════════════════════════
   Strip Layout — horizontal film strip
   ═══════════════════════════════════════════════════════════ */

function SprocketStrip({ count = 30 }: { count?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-between px-3"
      style={{ height: 22, background: FILM_BASE }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xs"
          style={{ width: 12, height: 8, background: SPROCKET_COLOR }}
        />
      ))}
    </div>
  );
}

function StripLayout({ photos, onPhotoClick, showGrain, className }: LayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn("select-none rounded-lg overflow-hidden", className)}
      style={{ background: FILM_DARK }}
    >
      <SprocketStrip count={Math.max(30, photos.length * 6)} />

      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scroll-smooth px-1 py-1"
        style={{ background: FILM_BASE, scrollSnapType: "x mandatory" }}
      >
        {photos.map((photo, i) => (
          <div
            key={i}
            className="group relative shrink-0 cursor-pointer"
            style={{ scrollSnapAlign: "center" }}
            onClick={() => onPhotoClick(i)}
          >
            {/* Film frame */}
            <div
              className="overflow-hidden rounded-xs border"
              style={{ borderColor: FRAME_BORDER, width: 280, height: 187 }}
            >
              <img
                src={photo.src}
                alt={photo.alt ?? photo.title ?? ""}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                draggable={false}
              />
              {/* Warm overlay */}
              <div
                className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "rgba(255, 175, 60, 0.06)" }}
              />
              {/* Grain overlay */}
              {showGrain && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]"
                  style={{
                    backgroundImage: GRAIN_SVG,
                    animation: "film-grain-shift 0.6s steps(5) infinite",
                  }}
                />
              )}
              {/* Vignette */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
                }}
              />
            </div>
            {/* Frame number */}
            <div
              className="mt-0.5 text-center font-mono text-[9px] tracking-widest"
              style={{ color: FRAME_NUM_COLOR }}
            >
              {String(i + 1).padStart(2, "0")}
              {i % 2 === 0 ? "" : "A"}
            </div>
          </div>
        ))}
      </div>

      <SprocketStrip count={Math.max(30, photos.length * 6)} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sheet Layout — contact sheet grid
   ═══════════════════════════════════════════════════════════ */

function SheetLayout({
  photos,
  onPhotoClick,
  showGrain,
  className,
  sheetTitle,
  sheetLabel,
}: LayoutProps) {
  return (
    <div className={cn("rounded-lg p-5", className)} style={{ background: FILM_DARK }}>
      {/* Film brand header */}
      <div className="mb-4 flex items-center justify-between">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color: FRAME_NUM_COLOR }}
        >
          {sheetTitle ?? `JAC\u00B7Film 35mm \u00B7 ${photos.length} exposures`}
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color: FRAME_NUM_COLOR }}
        >
          {sheetLabel ?? "Contact Sheet"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="group cursor-pointer"
            style={{ animation: `reveal-up 0.4s ease-out ${i * 50}ms both` }}
            onClick={() => onPhotoClick(i)}
          >
            <div
              className="mb-0.5 font-mono text-[9px] tracking-wider"
              style={{ color: FRAME_NUM_COLOR }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              className="relative overflow-hidden rounded-[1px] border transition-all duration-300 group-hover:border-amber-600/50 group-hover:shadow-[0_0_20px_rgba(217,171,89,0.15)]"
              style={{ borderColor: FRAME_BORDER, aspectRatio: "3/2" }}
            >
              <img
                src={photo.src}
                alt={photo.alt ?? ""}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                draggable={false}
              />
              {showGrain && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: GRAIN_SVG }}
                />
              )}
              {/* Hover title overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/70 to-transparent p-2 pt-6 transition-transform duration-300 group-hover:translate-y-0">
                <span className="text-xs font-medium text-white/90">{photo.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Stack Layout — fanning photo pile
   ═══════════════════════════════════════════════════════════ */

function StackLayout({ photos, onPhotoClick, showGrain, className }: LayoutProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVisible = Math.min(photos.length, 8);
  const visiblePhotos = photos.slice(0, maxVisible);

  const collapsedTransform = (i: number) => {
    const seed = Math.sin(i * 137.508 + 1) * 10000;
    const r = ((seed % 12) - 6).toFixed(1);
    const tx = (((seed / 7) % 8) - 4).toFixed(1);
    const ty = (((seed / 13) % 6) - 3).toFixed(1);
    return `rotate(${r}deg) translate(${tx}px, ${ty}px)`;
  };

  const expandedTransform = (i: number, total: number) => {
    const center = (total - 1) / 2;
    const angle = ((i - center) * 7).toFixed(1);
    const spread = ((i - center) * 110).toFixed(0);
    const lift = (-Math.abs(i - center) * 10 + (hovered === i ? -18 : 0)).toFixed(0);
    return `translateX(${spread}px) translateY(${lift}px) rotate(${angle}deg)`;
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        className="relative flex h-85 w-full items-center justify-center"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => {
          setExpanded(false);
          setHovered(null);
        }}
      >
        {visiblePhotos.map((photo, i) => (
          <div
            key={i}
            className="absolute cursor-pointer rounded-lg shadow-xl transition-all duration-500"
            style={{
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              transitionDelay: expanded ? `${i * 35}ms` : `${(maxVisible - i) * 25}ms`,
              transform: expanded
                ? expandedTransform(i, visiblePhotos.length)
                : collapsedTransform(i),
              zIndex: expanded ? i + 1 : visiblePhotos.length - i,
              width: 220,
              height: 147,
            }}
            onClick={() => onPhotoClick(i)}
            onMouseEnter={() => expanded && setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-lg border transition-shadow duration-300"
              style={{
                borderColor: expanded && hovered === i ? "rgba(217,171,89,0.5)" : FRAME_BORDER,
                boxShadow:
                  expanded && hovered === i
                    ? "0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(217,171,89,0.1)"
                    : "0 10px 30px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt ?? ""}
                className="h-full w-full object-cover"
                draggable={false}
              />
              {showGrain && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: GRAIN_SVG }}
                />
              )}
              {/* Vignette */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
                }}
              />
              {/* Title on hover */}
              {expanded && hovered === i && (
                <div
                  className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-8"
                  style={{ animation: "reveal-up 0.25s ease-out" }}
                >
                  <span className="text-sm font-medium text-white/90">{photo.title}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Remaining count */}
      {photos.length > maxVisible && (
        <span className="font-mono text-xs" style={{ color: FRAME_NUM_COLOR }}>
          + {photos.length - maxVisible} more
        </span>
      )}

      <span
        className="font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity duration-300"
        style={{ color: FRAME_NUM_COLOR, opacity: expanded ? 0 : 0.7 }}
      >
        Hover to explore
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Lightbox — immersive photo viewer
   ═══════════════════════════════════════════════════════════ */

interface LightboxProps {
  photos: FilmReelPhoto[];
  currentIndex: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  actions: FilmReelAction[];
  activeActions: Set<string>;
  onAction: (key: string, index: number) => void;
  showGrain: boolean;
}

function Lightbox({
  photos,
  currentIndex,
  onIndexChange,
  onClose,
  actions,
  activeActions,
  onAction,
  showGrain,
}: LightboxProps) {
  const photo = photos[currentIndex];
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [entered, setEntered] = useState(false);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const imageAreaRef = useRef<HTMLDivElement>(null);

  // Entrance animation trigger
  useLayoutEffect(() => {
    requestAnimationFrame(() => setEntered(true));
  }, []);

  // Lock body scroll
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          navigate(-1);
          break;
        case "ArrowRight":
          navigate(1);
          break;
        case "i":
        case "I":
          setShowInfo((v) => !v);
          break;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  // Wheel zoom (non-passive)
  useEffect(() => {
    const el = imageAreaRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      setZoom((prev) => {
        const next = Math.min(8, Math.max(1, prev * factor));
        if (next <= 1) setPan({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const navigate = useCallback(
    (dir: number) => {
      const next = currentIndex + dir;
      if (next >= 0 && next < photos.length) {
        onIndexChange(next);
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    },
    [currentIndex, photos.length, onIndexChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoom <= 1) return;
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [zoom],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      setPan((prev) => ({ x: prev.x + dx / zoom, y: prev.y + dy / zoom }));
    },
    [zoom],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2.5);
    }
  }, [zoom]);

  const isActionActive = (key: string) => activeActions.has(`${currentIndex}-${key}`);

  const meta = photo.metadata;

  return (
    <div
      className="fixed inset-0 z-200 flex flex-col"
      style={{ animation: "lightbox-backdrop-in 0.35s ease-out" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />

      {/* Grain overlay on backdrop */}
      {showGrain && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: GRAIN_SVG,
            animation: "film-grain-shift 0.6s steps(5) infinite",
          }}
        />
      )}

      {/* ── Top bar ────────────────────────── */}
      <div className="relative z-10 flex h-12 shrink-0 items-center justify-between px-4">
        <span className="font-mono text-sm text-white/50">
          {currentIndex + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-1">
          {/* Zoom indicator */}
          <span className="mr-2 font-mono text-xs text-white/40">{zoom.toFixed(1)}x</span>
          <button
            className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            onClick={() => setZoom((z) => Math.min(8, z * 1.3))}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            onClick={() => {
              setZoom((z) => {
                const next = Math.max(1, z * 0.7);
                if (next <= 1) setPan({ x: 0, y: 0 });
                return next;
              });
            }}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            onClick={onClose}
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Image area ─────────────────────── */}
      <div
        ref={imageAreaRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        style={{ cursor: zoom > 1 ? "grab" : "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        <img
          key={currentIndex}
          src={photo.src}
          alt={photo.alt ?? photo.title ?? ""}
          className="max-h-full max-w-full select-none object-contain"
          style={{
            animation: "lightbox-photo-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transition: isDragging.current ? "none" : "transform 0.15s ease-out",
          }}
          draggable={false}
        />

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white/70 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {currentIndex < photos.length - 1 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white/70 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* ── Metadata panel (slide up) ──────── */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 transition-all duration-400",
          showInfo ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <div className="bg-linear-to-t from-black/90 via-black/75 to-transparent px-6 pb-24 pt-16">
          {photo.title && <h3 className="mb-3 text-xl font-semibold text-white">{photo.title}</h3>}
          {photo.description && (
            <p
              className="mb-4 max-w-xl border-l-2 border-amber-500/40 pl-4 text-sm leading-relaxed text-white/60 italic"
              style={{ animation: "reveal-up 0.4s ease-out 0.1s both" }}
            >
              {photo.description}
            </p>
          )}
          {meta && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              {meta.camera && (
                <span className="flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-amber-400/80" /> {meta.camera}
                  {meta.lens && <span className="text-white/40">&middot;</span>}
                  {meta.lens && meta.lens}
                </span>
              )}
              {(meta.aperture || meta.shutter || meta.iso) && (
                <span className="flex items-center gap-1.5">
                  <Aperture className="h-3.5 w-3.5 text-amber-400/80" />
                  {[meta.aperture, meta.shutter, meta.iso && `ISO ${meta.iso}`]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
              {meta.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-400/80" /> {meta.date}
                </span>
              )}
              {meta.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400/80" /> {meta.location}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Actions bar ────────────────────── */}
      <div className="relative z-20 flex h-16 shrink-0 items-center justify-center gap-1">
        <div className="flex items-center gap-0.5 rounded-full bg-white/6 px-2 py-1.5 backdrop-blur-xl">
          {actions.map((action) => {
            const active = action.toggle && isActionActive(action.key);
            return (
              <button
                key={action.key}
                className={cn(
                  "rounded-full p-2.5 transition-all duration-200",
                  active
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
                onClick={() => onAction(action.key, currentIndex)}
                title={action.label}
              >
                {active && action.activeIcon ? action.activeIcon : action.icon}
              </button>
            );
          })}
          {/* Separator */}
          <div className="mx-1 h-5 w-px bg-white/10" />
          {/* Info toggle */}
          <button
            className={cn(
              "rounded-full p-2.5 transition-all duration-200",
              showInfo
                ? "text-amber-400 hover:text-amber-300"
                : "text-white/60 hover:bg-white/10 hover:text-white",
            )}
            onClick={() => setShowInfo((v) => !v)}
            title="Photo info (I)"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
