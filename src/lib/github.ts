// Commits src/data/content.json to a GitHub repo using a personal access token.
// The token never leaves the user's browser; it's stored in localStorage so the
// owner doesn't have to paste it every visit.

const TOKEN_KEY = "goodasscookies.gh.token";
const CONFIG_KEY = "goodasscookies.gh.config";
const CONTENT_PATH = "src/data/content.json";

export type GithubConfig = {
  owner: string;
  repo: string;
  branch: string;
};

export function loadToken(): string {
  try {
    return window.localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function loadConfig(): GithubConfig {
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return { owner: "", repo: "", branch: "main" };
}

export function saveConfig(cfg: GithubConfig) {
  window.localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

type ApiOpts = { token: string; cfg: GithubConfig };

async function gh(path: string, opts: ApiOpts, init: RequestInit = {}) {
  const url = `https://api.github.com${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${opts.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

export async function verifyAccess({ token, cfg }: ApiOpts): Promise<{ ok: true; login: string }> {
  const me = await gh("/user", { token, cfg });
  // Make sure the repo is also reachable with this token.
  await gh(`/repos/${cfg.owner}/${cfg.repo}`, { token, cfg });
  return { ok: true, login: me.login };
}

function utf8ToBase64(str: string): string {
  // Handles unicode safely.
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export async function publishContent(
  contentJson: unknown,
  { token, cfg }: ApiOpts
): Promise<{ commitUrl: string }> {
  const path = CONTENT_PATH;
  const branch = cfg.branch || "main";

  // Fetch current file SHA (required to update an existing file).
  let sha: string | undefined;
  try {
    const existing = await gh(
      `/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
      { token, cfg }
    );
    sha = existing.sha;
  } catch (err) {
    // 404 means the file doesn't exist yet — that's fine.
    if (!(err instanceof Error) || !err.message.startsWith("GitHub 404")) throw err;
  }

  const body = {
    message: `Update site content (${new Date().toISOString()})`,
    content: utf8ToBase64(JSON.stringify(contentJson, null, 2) + "\n"),
    branch,
    ...(sha ? { sha } : {}),
  };

  const result = await gh(
    `/repos/${cfg.owner}/${cfg.repo}/contents/${path}`,
    { token, cfg },
    { method: "PUT", body: JSON.stringify(body) }
  );

  return { commitUrl: result.commit?.html_url ?? "" };
}
