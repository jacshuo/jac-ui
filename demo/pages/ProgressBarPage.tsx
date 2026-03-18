import { useState, useEffect, useRef, useCallback } from "react";
import { ProgressBar } from "../../src";
import { Section, PageTitle } from "./helpers";

export default function ProgressBarPage() {
  /* ── animated value that loops 0→100 ─────────────── */
  const [auto, setAuto] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => {
    timer.current = setInterval(() => {
      setAuto((v) => (v >= 100 ? 0 : v + 1));
    }, 60);
    return () => clearInterval(timer.current);
  }, []);

  /* ── manual slider value ─────────────────────────── */
  const [manual, setManual] = useState(45);

  /* ── simulate a task that progresses then completes ─ */
  const [task, setTask] = useState(0);
  const [taskRunning, setTaskRunning] = useState(false);
  const startTask = useCallback(() => {
    setTask(0);
    setTaskRunning(true);
  }, []);
  useEffect(() => {
    if (!taskRunning) return;
    const id = setInterval(() => {
      setTask((v) => {
        if (v >= 100) {
          clearInterval(id);
          setTaskRunning(false);
          return 100;
        }
        return v + Math.random() * 8;
      });
    }, 200);
    return () => clearInterval(id);
  }, [taskRunning]);

  return (
    <div className="space-y-10">
      <PageTitle>ProgressBar</PageTitle>

      {/* ── Sizes ─────────────────────────────────────── */}
      <Section title="Sizes">
        <div className="space-y-4 max-w-lg">
          {(["xs", "sm", "md", "lg"] as const).map((s) => (
            <div key={s} className="space-y-1">
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                {s}
              </span>
              <ProgressBar value={auto} size={s} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Intents ───────────────────────────────────── */}
      <Section title="Intents (color)">
        <div className="space-y-4 max-w-lg">
          {(["primary", "success", "warning", "danger"] as const).map((intent) => (
            <div key={intent} className="space-y-1">
              <span className="text-xs font-medium capitalize text-primary-600 dark:text-primary-400">
                {intent}
              </span>
              <ProgressBar value={auto} intent={intent} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── With label ────────────────────────────────── */}
      <Section title="With percentage label">
        <div className="max-w-lg space-y-4">
          <ProgressBar value={auto} size="lg" intent="success" showLabel />
          <ProgressBar value={auto} size="md" intent="primary" showLabel />
        </div>
      </Section>

      {/* ── Animated (shine) ──────────────────────────── */}
      <Section title="Animated shine effect">
        <div className="max-w-lg space-y-4">
          <ProgressBar value={72} size="lg" intent="primary" animated />
          <ProgressBar value={50} size="lg" intent="success" animated />
          <ProgressBar value={88} size="lg" intent="warning" animated />
        </div>
      </Section>

      {/* ── Indeterminate ─────────────────────────────── */}
      <Section title="Indeterminate (loading)">
        <div className="max-w-lg space-y-4">
          <ProgressBar indeterminate intent="primary" />
          <ProgressBar indeterminate intent="warning" size="sm" />
          <ProgressBar indeterminate intent="danger" size="lg" />
        </div>
      </Section>

      {/* ── Edge-to-edge ──────────────────────────────── */}
      <Section title="Edge-to-edge (fixed top / bottom)">
        <p className="text-sm text-primary-500 dark:text-primary-400 mb-3">
          The bars below are fixed to the top and bottom of the viewport. Try scrolling!
        </p>
        <ProgressBar value={auto} edge="top" size="xs" intent="success" />
        <ProgressBar value={auto} edge="bottom" size="xs" intent="danger" />
      </Section>

      {/* ── Manual slider ─────────────────────────────── */}
      <Section title="Interactive (drag the slider)">
        <div className="max-w-lg space-y-3">
          <ProgressBar value={manual} size="lg" intent="primary" showLabel duration={100} />
          <input
            type="range"
            min={0}
            max={100}
            value={manual}
            onChange={(e) => setManual(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </Section>

      {/* ── Simulated task ────────────────────────────── */}
      <Section title="Simulated task">
        <div className="max-w-lg space-y-3">
          <ProgressBar
            value={Math.min(task, 100)}
            size="lg"
            intent={task >= 100 ? "success" : "primary"}
            showLabel
            animated={taskRunning}
          />
          <button
            type="button"
            onClick={startTask}
            disabled={taskRunning}
            className="rounded bg-primary-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {taskRunning ? "Running…" : task >= 100 ? "Run again" : "Start task"}
          </button>
        </div>
      </Section>
    </div>
  );
}
