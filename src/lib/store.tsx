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

const STORAGE_KEY = "lailahs.content.v4";
const ADMIN_SESSION_KEY = "lailahs.admin.session";
const ADMIN_ENABLED = import.meta.env.VITE_ENABLE_ADMIN === "true";

// True only when the admin password has been entered this browser session.
// We use this to decide whether localStorage should preview unpublished
// edits. Plain visitors always read the freshly-published content.json,
// never localStorage.
function isAdminSession() {
  if (!ADMIN_ENABLED || typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function loadInitial(): SiteContent {
  // 1. Admin's in-progress edits (only when they've unlocked the dashboard).
  if (isAdminSession()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as SiteContent;
    } catch {
      // fall through
    }
  }
  // 2. Published content from the repo.
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
    if (!isAdminSession()) return;
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
