import { describe, it, expect } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import { ContentProvider, useContent } from "./store";
import { seedContent } from "../data/seed";
import type { SiteContent } from "../types";

const ADMIN_SESSION_KEY = "lailahs.admin.session";
const STORAGE_KEY = "lailahs.content.v4";

function wrapper({ children }: { children: React.ReactNode }) {
  return <ContentProvider>{children}</ContentProvider>;
}

describe("ContentProvider — initial load", () => {
  it("falls back to seedContent when nothing is in localStorage", () => {
    const { result } = renderHook(() => useContent(), { wrapper });
    expect(result.current.content.shop.brandName).toBe(seedContent.shop.brandName);
    expect(result.current.content.menu.length).toBe(seedContent.menu.length);
  });

  it("ignores localStorage if admin is NOT in an unlocked session", () => {
    const tampered: SiteContent = {
      ...seedContent,
      shop: { ...seedContent.shop, brandName: "Evil Cookies" },
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tampered));
    // No admin session set.

    const { result } = renderHook(() => useContent(), { wrapper });
    expect(result.current.content.shop.brandName).toBe(seedContent.shop.brandName);
    expect(result.current.content.shop.brandName).not.toBe("Evil Cookies");
  });

  it("uses localStorage when an admin session is unlocked", () => {
    const draft: SiteContent = {
      ...seedContent,
      shop: { ...seedContent.shop, brandName: "Draft Title" },
    };
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));

    const { result } = renderHook(() => useContent(), { wrapper });
    expect(result.current.content.shop.brandName).toBe("Draft Title");
  });

  it("ignores corrupt localStorage and falls back to seed", () => {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    window.localStorage.setItem(STORAGE_KEY, "{not valid json");

    const { result } = renderHook(() => useContent(), { wrapper });
    expect(result.current.content.shop.brandName).toBe(seedContent.shop.brandName);
  });
});

describe("ContentProvider — setContent + resetToSeed", () => {
  it("setContent replaces the current content", () => {
    const { result } = renderHook(() => useContent(), { wrapper });
    const next: SiteContent = {
      ...result.current.content,
      shop: { ...result.current.content.shop, tagline: "New tagline" },
    };
    act(() => result.current.setContent(next));
    expect(result.current.content.shop.tagline).toBe("New tagline");
  });

  it("persists to localStorage when admin session is active", () => {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    const { result } = renderHook(() => useContent(), { wrapper });
    act(() => {
      result.current.setContent({
        ...result.current.content,
        shop: { ...result.current.content.shop, brandName: "Persisted" },
      });
    });
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const stored = JSON.parse(raw!);
    expect(stored.shop.brandName).toBe("Persisted");
  });

  it("does NOT persist to localStorage when no admin session", () => {
    const { result } = renderHook(() => useContent(), { wrapper });
    act(() => {
      result.current.setContent({
        ...result.current.content,
        shop: { ...result.current.content.shop, brandName: "Ghost" },
      });
    });
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("resetToSeed brings content back to the seed", () => {
    const { result } = renderHook(() => useContent(), { wrapper });
    act(() =>
      result.current.setContent({
        ...result.current.content,
        shop: { ...result.current.content.shop, brandName: "WIP" },
      })
    );
    expect(result.current.content.shop.brandName).toBe("WIP");
    act(() => result.current.resetToSeed());
    expect(result.current.content.shop.brandName).toBe(seedContent.shop.brandName);
  });
});

describe("useContent outside the provider", () => {
  it("throws a helpful error", () => {
    // Silence the noisy React error boundary log for this expected throw.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<UseContentProbe />)).toThrow(
      /useContent must be used inside <ContentProvider>/
    );
    spy.mockRestore();
  });
});

function UseContentProbe() {
  useContent();
  return null;
}
