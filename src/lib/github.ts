// Commits src/data/content.json to a GitHub repo using a fine-grained
// personal access token. The repo (owner/name/branch) is hardcoded at
// build time via VITE_GH_* env vars; the dashboard only ever asks the
// user for the PAT. The token never leaves the user's browser, and a
// properly-scoped PAT can ONLY touch this single repo.

const TOKEN_KEY = "lailahs.gh.token";
const CONTENT_PATH = "src/data/content.json";

export const REPO = {
  owner: import.meta.env.VITE_GH_OWNER ?? "",
  repo: import.meta.env.VITE_GH_REPO ?? "",
  branch: import.meta.env.VITE_GH_BRANCH ?? "main",
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

async function gh(path: string, token: string, init: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
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

export async function verifyAccess(token: string): Promise<{ login: string }> {
  // /user confirms the token works at all.
  const me = await gh("/user", token);
  // Reading the repo confirms the token actually has access to *this*
  // repo (a token scoped elsewhere would 404 even though /user succeeded).
  await gh(`/repos/${REPO.owner}/${REPO.repo}`, token);
  return { login: me.login };
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export async function publishContent(
  contentJson: unknown,
  token: string
): Promise<{ commitUrl: string }> {
  const path = CONTENT_PATH;
  const branch = REPO.branch;

  let sha: string | undefined;
  try {
    const existing = await gh(
      `/repos/${REPO.owner}/${REPO.repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
      token
    );
    sha = existing.sha;
  } catch (err) {
    // 404 is expected if content.json hasn't been committed yet.
    if (!(err instanceof Error) || !err.message.startsWith("GitHub 404")) throw err;
  }

  const body = {
    message: `Update site content (${new Date().toISOString()})`,
    content: utf8ToBase64(JSON.stringify(contentJson, null, 2) + "\n"),
    branch,
    ...(sha ? { sha } : {}),
  };

  const result = await gh(
    `/repos/${REPO.owner}/${REPO.repo}/contents/${path}`,
    token,
    { method: "PUT", body: JSON.stringify(body) }
  );

  return { commitUrl: result.commit?.html_url ?? "" };
}
