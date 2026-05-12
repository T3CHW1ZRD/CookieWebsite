import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SiteContent } from "../types";
import { seedContent } from "../data/seed";
import contentJson from "../data/content.json";

const STORAGE_KEY = "lailahs.content.v1";

function loadInitial(): SiteContent {
  // 1. Use what's saved in this browser, if anything.
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as SiteContent;
    } catch {
      // fall through
    }
  }
  // 2. Use the committed content.json if it has real data.
  const fromFile = contentJson as Partial<SiteContent>;
  if (fromFile.menu && fromFile.menu.length > 0) {
    return fromFile as SiteContent;
  }
  // 3. Otherwise fall back to the in-code seed.
  return seedContent;
}

type ContentContextValue = {
  content: SiteContent;
  setContent: (next: SiteContent) => void;
  resetToSeed: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // localStorage may be unavailable (private mode); ignore.
    }
  }, [content]);

  const setContent = useCallback((next: SiteContent) => setContentState(next), []);
  const resetToSeed = useCallback(() => setContentState(seedContent), []);

  const value = useMemo(
    () => ({ content, setContent, resetToSeed }),
    [content, setContent, resetToSeed]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
