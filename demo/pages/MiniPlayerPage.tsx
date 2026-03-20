import { useState } from "react";
import { MiniPlayer, Dropdown, type MiniPlayerTrack, type MiniPlayerPosition } from "../../src";
import { CodeExample } from "./helpers";

/* ── Sample playlist with free CC0 audio ───────────── */
const samplePlaylist: MiniPlayerTrack[] = [
  {
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    album: "Bensound Moods",
    src: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
  },
  {
    title: "Inspiring",
    artist: "Mixkit",
    album: "Free Tracks",
    src: "https://assets.mixkit.co/music/preview/mixkit-inspiring-cinematic-2489.mp3",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop",
  },
  {
    title: "Happy Whistling Ukulele",
    artist: "Mixkit",
    album: "Free Tracks",
    src: "https://assets.mixkit.co/music/preview/mixkit-happy-whistling-ukulele-2492.mp3",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop",
  },
  {
    title: "Tech House",
    artist: "Mixkit",
    album: "Electronic Moods",
    src: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop",
  },
  {
    title: "Dreamy Slow Festival",
    artist: "Mixkit",
    album: "Chill Sessions",
    src: "https://assets.mixkit.co/music/preview/mixkit-dreamy-slow-festival-music-2495.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    title: "Relaxing Mountain",
    artist: "Mixkit",
    album: "Ambient Collection",
    src: "https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3",
    cover: "https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?w=200&h=200&fit=crop",
  },
  {
    title: "Winning Elevation",
    artist: "Mixkit",
    album: "Epic Moments",
    src: "https://assets.mixkit.co/music/preview/mixkit-winning-elevation-474.mp3",
    cover: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=200&h=200&fit=crop",
  },
  {
    title: "Dark Hip Hop",
    artist: "Mixkit",
    album: "Urban Beats",
    src: "https://assets.mixkit.co/music/preview/mixkit-dark-hip-hop-intro-189.mp3",
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=200&fit=crop",
  },
  {
    title: "Piano Ballad",
    artist: "Mixkit",
    album: "Solo Keys",
    src: "https://assets.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3",
    cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&h=200&fit=crop",
  },
  {
    title: "Retro Arcade",
    artist: "Mixkit",
    album: "Game Soundtracks",
    src: "https://assets.mixkit.co/music/preview/mixkit-retro-game-emergency-alarm-1000.mp3",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop",
  },
];

/* ── Positions ─────────────────────────────────────── */
const positions: MiniPlayerPosition[] = ["bottom-right", "bottom-left", "top-right", "top-left"];
const entrances = ["bottom", "top", "left", "right"] as const;

export default function MiniPlayerPage() {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState<MiniPlayerPosition>("bottom-right");
  const [entrance, setEntrance] = useState<(typeof entrances)[number]>("bottom");
  const [docked, setDocked] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light" | "auto">("auto");
  const [accent, setAccent] = useState("#8b5cf6");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">MiniPlayer</h1>
        <p className="mt-1 text-sm text-primary-500 dark:text-primary-400">
          A stylish floating mini music player with entrance/exit animations, playlist, dock-to-edge
          mode and theme control.
        </p>
      </div>
      {/* ── Controls ────────────────────── */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {/* Visibility */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            Visibility
          </label>
          <button
            className="w-full rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500"
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? "Hide Player" : "Show Player"}
          </button>
        </div>

        {/* Position */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            Position
          </label>
          <Dropdown
            options={positions.map((p) => ({ value: p, label: p }))}
            value={position}
            onChange={(v) => setPosition(v as MiniPlayerPosition)}
            placeholder="Position"
            className="w-full"
          />
        </div>

        {/* Entrance */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            Entrance
          </label>
          <Dropdown
            options={entrances.map((e) => ({ value: e, label: e }))}
            value={entrance}
            onChange={(v) => setEntrance(v as (typeof entrances)[number])}
            placeholder="Entrance"
            className="w-full"
          />
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            Theme
          </label>
          <Dropdown
            options={[
              { value: "auto", label: "Auto (inherit)" },
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
            value={theme}
            onChange={(v) => setTheme(v as "dark" | "light" | "auto")}
            placeholder="Theme"
            className="w-full"
          />
        </div>

        {/* Dock mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            Dock to Edge
          </label>
          <button
            className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              docked
                ? "bg-amber-500 text-white hover:bg-amber-400"
                : "bg-primary-200 text-primary-600 hover:bg-primary-300 dark:bg-primary-700 dark:text-primary-300"
            }`}
            onClick={() => setDocked((d) => !d)}
          >
            {docked ? "Docked ✓" : "Undocked"}
          </button>
        </div>

        {/* Auto Play */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            Auto Play
          </label>
          <button
            className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              autoPlay
                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                : "bg-primary-200 text-primary-600 hover:bg-primary-300 dark:bg-primary-700 dark:text-primary-300"
            }`}
            onClick={() => setAutoPlay((a) => !a)}
          >
            {autoPlay ? "Auto Play ✓" : "Auto Play Off"}
          </button>
        </div>

        {/* Shuffle */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            Shuffle
          </label>
          <button
            className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              shuffle
                ? "bg-fuchsia-500 text-white hover:bg-fuchsia-400"
                : "bg-primary-200 text-primary-600 hover:bg-primary-300 dark:bg-primary-700 dark:text-primary-300"
            }`}
            onClick={() => setShuffle((s) => !s)}
          >
            {shuffle ? "Shuffle ✓" : "Shuffle Off"}
          </button>
        </div>
      </div>
      {/* ── Accent color ────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
          Accent:
        </span>
        {[
          ["#8b5cf6", "Violet"],
          ["#3b82f6", "Blue"],
          ["#10b981", "Emerald"],
          ["#f43f5e", "Rose"],
          ["#f59e0b", "Amber"],
          ["#ec4899", "Pink"],
        ].map(([color, name]) => (
          <button
            key={color}
            className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${accent === color ? "border-white scale-110 ring-2 ring-primary-400" : "border-transparent"}`}
            style={{ backgroundColor: color }}
            onClick={() => setAccent(color)}
            title={name}
          />
        ))}
      </div>
      {/* ── Event log ───────────────────── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
          Event Log
        </h3>
        <div className="h-40 overflow-y-auto rounded-lg border border-primary-200 bg-primary-50 p-3 font-mono text-xs text-primary-600 dark:border-primary-700 dark:bg-primary-900/50 dark:text-primary-400">
          {log.length === 0 ? (
            <span className="italic opacity-50">Interact with the player to see events…</span>
          ) : (
            log.map((l, i) => <div key={i}>{l}</div>)
          )}
        </div>
      </div>
      {/* ── Player instance ─────────────── */}
      <MiniPlayer
        playlist={samplePlaylist}
        position={position}
        entrance={entrance}
        theme={theme === "auto" ? undefined : theme}
        docked={docked}
        visible={visible}
        autoPlay={autoPlay}
        shuffle={shuffle}
        accent={accent}
        onVisibleChange={(v) => {
          setVisible(v);
          addLog(`Visibility → ${v}`);
        }}
        onTrackChange={(idx, t) => addLog(`Track → #${idx + 1} "${t.title}"`)}
        onLike={(idx, t, liked) => addLog(`${liked ? "❤️ Liked" : "💔 Unliked"} "${t.title}"`)}
      />
      {/* ── Usage example ───────────────────────────── */}
      <CodeExample
        code={`<MiniPlayer
  playlist={[
    { title: "Track 1", artist: "Artist", src: "/audio/track1.mp3", cover: "/cover.jpg" },
  ]}
  position="bottom-right"
  entrance="bottom"
  visible={visible}
  autoPlay
  accent="#8b5cf6"
  onVisibleChange={setVisible}
  onTrackChange={(idx, track) => console.log(idx, track.title)}
/>`}
      />{" "}
    </div>
  );
}
