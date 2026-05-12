import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Github,
  Download,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useContent } from "../lib/store";
import {
  REPO,
  loadToken,
  publishContent,
  saveToken,
  verifyAccess,
} from "../lib/github";

type State =
  | { kind: "idle" }
  | { kind: "verifying" }
  | { kind: "verified"; login: string }
  | { kind: "publishing" }
  | { kind: "published"; commitUrl: string }
  | { kind: "error"; message: string };

export default function PublishPanel() {
  const { content } = useContent();
  const [token, setTokenState] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    setTokenState(loadToken());
  }, []);

  function persistToken(next: string) {
    setTokenState(next);
    saveToken(next);
    setState({ kind: "idle" });
  }

  async function verify() {
    if (!token) {
      setState({ kind: "error", message: "Paste your access token first." });
      return;
    }
    setState({ kind: "verifying" });
    try {
      const r = await verifyAccess(token);
      setState({ kind: "verified", login: r.login });
    } catch (e) {
      setState({ kind: "error", message: (e as Error).message });
    }
  }

  async function publish() {
    if (!token) {
      setState({ kind: "error", message: "Paste your access token first." });
      return;
    }
    setState({ kind: "publishing" });
    try {
      const r = await publishContent(content, token);
      setState({ kind: "published", commitUrl: r.commitUrl });
    } catch (e) {
      setState({ kind: "error", message: (e as Error).message });
    }
  }

  function download() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <section className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Github size={22} className="text-primary" />
          <h2 className="font-display text-2xl">Publish your changes</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Paste your access token <strong>once</strong>. After that, every edit just needs the
          green <strong>Publish</strong> button — your changes go live in about a minute.
        </p>

        <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground border border-border">
          Connected repo: <code className="font-mono text-foreground">{REPO.owner}/{REPO.repo}</code>
          {" · branch "}
          <code className="font-mono text-foreground">{REPO.branch}</code>
        </div>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Access token</span>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              value={token}
              onChange={(e) => persistToken(e.target.value)}
              placeholder="github_pat_..."
              className="w-full rounded-lg border border-border bg-background pl-3 pr-11 py-3 outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowToken((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
              aria-label={showToken ? "Hide token" : "Show token"}
            >
              {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <span className="mt-1 block text-xs text-muted-foreground">
            Stored in this browser only. Never sent anywhere except github.com.
          </span>
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={verify}
            disabled={state.kind === "verifying"}
            className="btn-ghost text-sm py-2 px-4"
          >
            {state.kind === "verifying" && <Loader2 size={16} className="animate-spin" />}
            Test connection
          </button>
          <button
            onClick={publish}
            disabled={state.kind === "publishing"}
            className="btn-primary text-sm py-2 px-4"
          >
            {state.kind === "publishing" && <Loader2 size={16} className="animate-spin" />}
            {state.kind === "publishing" ? "Publishing…" : "Publish"}
          </button>
          <button onClick={download} className="btn-ghost text-sm py-2 px-4">
            <Download size={16} /> Download backup
          </button>
        </div>

        {state.kind === "verified" && (
          <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            Connected as <strong>{state.login}</strong>. Ready to publish.
          </div>
        )}
        {state.kind === "published" && (
          <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <div>
              <strong>Published!</strong> The site will rebuild in about 1 minute. Refresh the
              main page to see your changes.{" "}
              {state.commitUrl && (
                <a
                  href={state.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline inline-flex items-center gap-1"
                >
                  View commit <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        )}
        {state.kind === "error" && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <strong>Couldn&rsquo;t connect.</strong>
              <p className="mt-1 break-all">{state.message}</p>
              <p className="mt-2 text-xs">
                Most common cause: the token expired, or it doesn&rsquo;t have access to the
                connected repo. Ask whoever set up your site for a fresh one.
              </p>
            </div>
          </div>
        )}
      </section>

      <aside className="rounded-2xl border border-border bg-card p-6 text-sm space-y-3">
        <h3 className="font-display text-xl">First-time setup</h3>
        <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
          <li>Make your edits in the other tabs (Shop info, Flavours, Pricing, Gallery).</li>
          <li>Come to this tab and paste the access token you were given.</li>
          <li>
            Hit <strong>Test connection</strong>. You should see &ldquo;Ready to publish.&rdquo;
          </li>
          <li>
            Hit <strong>Publish</strong>. Wait about a minute, then refresh the site.
          </li>
        </ol>
        <p className="pt-2 text-xs text-muted-foreground">
          You only paste the token <strong>once per browser</strong>. After that, just edit and
          hit Publish.
        </p>
      </aside>
    </div>
  );
}
