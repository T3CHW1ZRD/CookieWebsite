import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Github, Download, ExternalLink, Loader2 } from "lucide-react";
import { useContent } from "../lib/store";
import {
  loadConfig,
  loadToken,
  publishContent,
  saveConfig,
  saveToken,
  verifyAccess,
  type GithubConfig,
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
  const [cfg, setCfgState] = useState<GithubConfig>({ owner: "", repo: "", branch: "main" });
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    setTokenState(loadToken());
    setCfgState(loadConfig());
  }, []);

  function persistCfg(next: GithubConfig) {
    setCfgState(next);
    saveConfig(next);
  }
  function persistToken(next: string) {
    setTokenState(next);
    saveToken(next);
    setState({ kind: "idle" });
  }

  async function verify() {
    if (!token || !cfg.owner || !cfg.repo) {
      setState({ kind: "error", message: "Fill in the token, owner, and repo first." });
      return;
    }
    setState({ kind: "verifying" });
    try {
      const r = await verifyAccess({ token, cfg });
      setState({ kind: "verified", login: r.login });
    } catch (e) {
      setState({ kind: "error", message: (e as Error).message });
    }
  }

  async function publish() {
    if (!token || !cfg.owner || !cfg.repo) {
      setState({ kind: "error", message: "Fill in the token, owner, and repo first." });
      return;
    }
    setState({ kind: "publishing" });
    try {
      const r = await publishContent(content, { token, cfg });
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
          <h2 className="font-display text-2xl">Publish to your website</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect once. After that, hit <strong>Publish</strong> and your edits go live in about a
          minute.
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-sm font-medium mb-1">GitHub username</span>
            <input
              value={cfg.owner}
              onChange={(e) => persistCfg({ ...cfg, owner: e.target.value.trim() })}
              placeholder="e.g. ayham"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-1">Repo name</span>
            <input
              value={cfg.repo}
              onChange={(e) => persistCfg({ ...cfg, repo: e.target.value.trim() })}
              placeholder="goodasscookies"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-1">Branch</span>
            <input
              value={cfg.branch}
              onChange={(e) => persistCfg({ ...cfg, branch: e.target.value.trim() || "main" })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium mb-1">GitHub token</span>
          <input
            type="password"
            value={token}
            onChange={(e) => persistToken(e.target.value)}
            placeholder="github_pat_..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Saved in this browser only. Never sent anywhere except github.com.
          </span>
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={verify}
            disabled={state.kind === "verifying"}
            className="btn-ghost text-sm py-2 px-4"
          >
            {state.kind === "verifying" ? <Loader2 size={16} className="animate-spin" /> : null}
            Test connection
          </button>
          <button
            onClick={publish}
            disabled={state.kind === "publishing"}
            className="btn-primary text-sm py-2 px-4"
          >
            {state.kind === "publishing" ? <Loader2 size={16} className="animate-spin" /> : null}
            {state.kind === "publishing" ? "Publishing…" : "Publish"}
          </button>
          <button onClick={download} className="btn-ghost text-sm py-2 px-4">
            <Download size={16} /> Download JSON
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
              Published! GitHub Pages will rebuild in about 1 minute.{" "}
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
            </div>
          </div>
        )}
      </section>

      <aside className="rounded-2xl border border-border bg-card p-6 text-sm space-y-3">
        <h3 className="font-display text-xl">First-time setup</h3>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>
            Open{" "}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              github.com → fine-grained tokens
            </a>
            .
          </li>
          <li>Token name: anything. Expiration: 1 year.</li>
          <li>
            Repository access → <strong>Only select repositories</strong> → pick your site repo.
          </li>
          <li>
            Permissions → <strong>Contents: Read and write</strong>. That&rsquo;s the only one needed.
          </li>
          <li>Click <strong>Generate</strong>, copy the token, paste it here.</li>
          <li>Click <strong>Test connection</strong>, then <strong>Publish</strong>.</li>
        </ol>
        <p className="pt-2 text-xs text-muted-foreground">
          You only do this once. After that, every edit is just &ldquo;Publish.&rdquo;
        </p>
      </aside>
    </div>
  );
}
