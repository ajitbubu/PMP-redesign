import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement ResizeObserver, which Radix primitives (checkbox,
// select, popover…) touch on mount. Provide a no-op so component tests that
// render those primitives don't crash.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}
