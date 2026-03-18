import "@testing-library/jest-dom/vitest";

// jsdom does not implement ResizeObserver
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
