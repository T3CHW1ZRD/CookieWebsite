import { useState, type ReactNode } from "react";
import { Lock } from "lucide-react";

// Set the password here. This is *display-level* only — anyone who can read
// the built JS could find it. Real security comes from the GitHub token
// (which only the owner pastes in once). The password just keeps strangers
// from poking around the dashboard UI.
const ADMIN_PASSWORD = "cookies123";
const SESSION_KEY = "goodasscookies.admin.session";

export default function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => window.sessionStorage.getItem(SESSION_KEY) === "1"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError("Wrong password.");
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
        <button type="submit" className="btn-primary mt-6 w-full">
          Unlock
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Forgot your password? Ask whoever built this site.
        </p>
      </form>
    </div>
  );
}
