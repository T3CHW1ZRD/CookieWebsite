import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.sessionStorage.clear();
  vi.restoreAllMocks();
});

// Stub framer-motion to plain elements so component tests don't need
// the full animation runtime. Keeps tests fast and viewport-agnostic.
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const passthrough = (tag: string) =>
    React.forwardRef<HTMLElement, Record<string, unknown>>(function MotionStub(
      { children, ...rest },
      ref
    ) {
      // Drop framer-only props before passing the rest to a real DOM element.
      const {
        initial: _i,
        animate: _a,
        exit: _e,
        transition: _t,
        whileInView: _wiv,
        whileHover: _wh,
        whileTap: _wt,
        viewport: _v,
        ...domProps
      } = rest as Record<string, unknown>;
      return React.createElement(tag, { ref, ...domProps }, children as React.ReactNode);
    });
  return {
    motion: new Proxy(
      {},
      {
        get: (_t, key: string) => passthrough(key),
      }
    ),
  };
});
