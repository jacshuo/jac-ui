import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ToastProvider, useToast } from "../components/Feedback/Toast";
import type { ToastOptions } from "../components/Feedback/Toast";

/* ── Helper: component that can trigger toasts ─────── */

function TestBed({ options }: { options?: ToastOptions }) {
  const { toast, dismiss, dismissAll } = useToast();
  return (
    <div>
      <button onClick={() => toast(options ?? { title: "Hello", description: "World" })}>
        trigger
      </button>
      <button onClick={() => dismissAll()}>dismiss-all</button>
    </div>
  );
}

function renderWithProvider(options?: ToastOptions) {
  return render(
    <ToastProvider>
      <TestBed options={options} />
    </ToastProvider>,
  );
}

/* ── useToast outside provider ─────────────────────── */

describe("useToast", () => {
  it("throws when used outside ToastProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      render(
        React.createElement(() => {
          useToast();
          return null;
        }),
      );
    }).toThrow("useToast must be used within a <ToastProvider>");
    consoleError.mockRestore();
  });
});

/* ── ToastProvider renders children ────────────────── */

describe("ToastProvider", () => {
  it("renders children", () => {
    render(
      <ToastProvider>
        <span>child content</span>
      </ToastProvider>,
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });
});

/* ── Toast rendering ───────────────────────────────── */

describe("Toast rendering", () => {
  it("shows a toast with title and description", async () => {
    const user = userEvent.setup();
    renderWithProvider({ title: "Test title", description: "Test description" });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("shows a toast with title only", async () => {
    const user = userEvent.setup();
    renderWithProvider({ title: "Just a title" });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getByText("Just a title")).toBeInTheDocument();
  });

  it("shows a toast with description only", async () => {
    const user = userEvent.setup();
    renderWithProvider({ description: "Only description" });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getByText("Only description")).toBeInTheDocument();
  });

  it("renders dismiss button by default", async () => {
    const user = userEvent.setup();
    renderWithProvider({ title: "Dismissible" });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getByRole("button", { name: "Dismiss notification" })).toBeInTheDocument();
  });

  it("hides dismiss button when dismissible=false", async () => {
    const user = userEvent.setup();
    renderWithProvider({ title: "No dismiss", dismissible: false });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.queryByRole("button", { name: "Dismiss notification" })).not.toBeInTheDocument();
  });

  it("renders action button when action is provided", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProvider({
      title: "With action",
      action: { label: "Undo", onClick },
    });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("calls action.onClick when action button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProvider({
      title: "Action toast",
      action: { label: "Retry", onClick },
    });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("has role=status for accessibility", async () => {
    const user = userEvent.setup();
    renderWithProvider({ title: "Accessible" });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

/* ── Multiple toasts ───────────────────────────────── */

describe("Multiple toasts", () => {
  it("stacks multiple toasts", async () => {
    const user = userEvent.setup();
    renderWithProvider({ title: "Stacked" });
    await user.click(screen.getByRole("button", { name: "trigger" }));
    await user.click(screen.getByRole("button", { name: "trigger" }));
    await user.click(screen.getByRole("button", { name: "trigger" }));
    expect(screen.getAllByText("Stacked")).toHaveLength(3);
  });
});

/* ── Dismissal ─────────────────────────────────────── */

describe("Toast dismissal", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("removes toast after clicking dismiss button", async () => {
    renderWithProvider({ title: "Bye", duration: 0 });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "trigger" }));
    });
    expect(screen.getByText("Bye")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    });
    // advance past EXIT_MS (320 ms)
    act(() => void vi.advanceTimersByTime(400));
    expect(screen.queryByText("Bye")).not.toBeInTheDocument();
  });

  it("removes all toasts after dismissAll", async () => {
    renderWithProvider({ title: "One", duration: 0 });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "trigger" }));
      fireEvent.click(screen.getByRole("button", { name: "trigger" }));
    });
    expect(screen.getAllByText("One")).toHaveLength(2);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "dismiss-all" }));
    });
    act(() => void vi.advanceTimersByTime(400));
    expect(screen.queryByText("One")).not.toBeInTheDocument();
  });

  it("auto-dismisses after duration", async () => {
    renderWithProvider({ title: "Auto-bye", duration: 1000 });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "trigger" }));
    });
    expect(screen.getByText("Auto-bye")).toBeInTheDocument();

    act(() => void vi.advanceTimersByTime(1000 + 400));
    expect(screen.queryByText("Auto-bye")).not.toBeInTheDocument();
  });

  it("does not auto-dismiss when duration=0", async () => {
    renderWithProvider({ title: "Persistent", duration: 0 });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "trigger" }));
    });
    act(() => void vi.advanceTimersByTime(10000));
    expect(screen.getByText("Persistent")).toBeInTheDocument();
  });

  it("calls onDismiss callback when dismissed manually", async () => {
    const onDismiss = vi.fn();
    renderWithProvider({ title: "Callback", duration: 0, onDismiss });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "trigger" }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    });
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

/* ── Variant CVA classes spot-check ────────────────── */

describe("Toast variants", () => {
  const variants = ["default", "success", "danger", "warning", "info"] as const;

  variants.forEach((variant) => {
    it(`renders ${variant} variant without crashing`, async () => {
      const user = userEvent.setup();
      renderWithProvider({ title: `${variant} toast`, variant });
      await user.click(screen.getByRole("button", { name: "trigger" }));
      expect(screen.getByText(`${variant} toast`)).toBeInTheDocument();
    });
  });
});

/* ── Provider default props ────────────────────────── */

describe("ToastProvider default props", () => {
  it("accepts custom defaultPosition and defaultDuration without error", () => {
    expect(() =>
      render(
        <ToastProvider defaultPosition="bottom-center" defaultDuration={2000}>
          <span>ok</span>
        </ToastProvider>,
      ),
    ).not.toThrow();
  });
});
