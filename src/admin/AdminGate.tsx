import { useState, type ReactNode } from "react";
import { Lock, Loader2 } from "lucide-react";

// SHA-256 hash of the actual password. The plaintext is NEVER stored
// anywhere in the repo or the bundle. On login we hash the user's input
// and compare. To rotate the password:
//   node -e "console.log(require('crypto').createHash('sha256').update('NEW_PASSWORD').digest('hex'))"
// then paste the output here.
const ADMIN_PASSWORD_HASH = "c9be8320fcf88bbc5366be97d00afc106dd8751a1136e4491550367fe9f3090a";

export const SESSION_KEY = "lailahs.admin.session";

async function sha256Hex(str: string): Promise<string> {
  const bytes = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => window.sessionStorage.getItem(SESSION_KEY) === "1"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setChecking(true);
    try {
      const hash = await sha256Hex(password);
      if (hash === ADMIN_PASSWORD_HASH) {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        setUnlocked(true);
      } else {
        setError("Wrong password.");
      }
    } finally {
      setChecking(false);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-display">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Owner login</p>
          </div>
        </div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-primary">{error}</p>}
        <button
          type="submit"
          disabled={checking}
          className="btn-primary mt-6 w-full disabled:opacity-60"
        >
          {checking && <Loader2 size={16} className="animate-spin" />}
          {checking ? "Checking…" : "Unlock"}
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Forgot your password? Ask whoever built this site.
        </p>
      </form>
    </div>
  );
}
