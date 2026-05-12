import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  REPO,
  loadToken,
  saveToken,
  clearToken,
  verifyAccess,
  publishContent,
} from "./github";

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  return vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    return Promise.resolve(handler(url, init));
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("github.ts — token storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns empty string when no token stored", () => {
    expect(loadToken()).toBe("");
  });

  it("round-trips a token through localStorage", () => {
    saveToken("github_pat_xyz");
    expect(loadToken()).toBe("github_pat_xyz");
  });

  it("clearToken removes the stored token", () => {
    saveToken("github_pat_xyz");
    clearToken();
    expect(loadToken()).toBe("");
  });
});

describe("github.ts — REPO config from env", () => {
  it("is populated from VITE_GH_* env vars (or empty strings in test env)", () => {
    // In the test env those vars may or may not be set; we just confirm the
    // exported object has the expected shape so consumers don't crash.
    expect(REPO).toHaveProperty("owner");
    expect(REPO).toHaveProperty("repo");
    expect(REPO).toHaveProperty("branch");
    expect(typeof REPO.branch).toBe("string");
  });
});

describe("github.ts — verifyAccess", () => {
  it("hits /user and /repos/{owner}/{repo} with the bearer token", async () => {
    const calls: { url: string; auth?: string }[] = [];
    mockFetch((url, init) => {
      calls.push({
        url,
        auth: (init?.headers as Record<string, string> | undefined)?.["Authorization"],
      });
      if (url.endsWith("/user")) return jsonResponse({ login: "T3CHW1ZRD" });
      return jsonResponse({ name: "CookieWebsite" });
    });

    const result = await verifyAccess("github_pat_test");
    expect(result.login).toBe("T3CHW1ZRD");
    expect(calls).toHaveLength(2);
    expect(calls[0].url).toContain("/user");
    expect(calls[0].auth).toBe("Bearer github_pat_test");
    expect(calls[1].url).toMatch(/\/repos\/[^/]+\/[^/]+$/);
  });

  it("throws when /user returns 401", async () => {
    mockFetch(() => new Response("Bad creds", { status: 401 }));
    await expect(verifyAccess("bad-token")).rejects.toThrow(/GitHub 401/);
  });

  it("throws when /user passes but the repo is unreachable (token wrong scope)", async () => {
    mockFetch((url) => {
      if (url.endsWith("/user")) return jsonResponse({ login: "me" });
      return new Response("Not Found", { status: 404 });
    });
    await expect(verifyAccess("scoped-elsewhere")).rejects.toThrow(/GitHub 404/);
  });
});

describe("github.ts — publishContent", () => {
  it("PUTs base64-encoded JSON content to the contents endpoint", async () => {
    let putBody: unknown;
    mockFetch((url, init) => {
      if (init?.method === "PUT") {
        putBody = JSON.parse(init.body as string);
        return jsonResponse({ commit: { html_url: "https://example/commit/abc" } });
      }
      // GET for existing SHA
      return jsonResponse({ sha: "existing-sha-deadbeef" });
    });

    const content = { menu: [{ id: "m1", name: "Test" }] };
    const r = await publishContent(content, "github_pat_test");

    expect(r.commitUrl).toBe("https://example/commit/abc");
    expect(putBody).toMatchObject({
      branch: expect.any(String),
      message: expect.stringMatching(/Update site content/),
      sha: "existing-sha-deadbeef",
    });

    // Verify base64 content decodes to the input JSON.
    const decoded = atob((putBody as Record<string, string>).content);
    expect(JSON.parse(decoded.trim())).toEqual(content);
  });

  it("omits sha when the file doesn't exist yet (first publish)", async () => {
    let putBody: Record<string, unknown> | undefined;
    mockFetch((url, init) => {
      if (init?.method === "PUT") {
        putBody = JSON.parse(init.body as string);
        return jsonResponse({ commit: { html_url: "https://example/commit/new" } });
      }
      // Simulate 404 on the GET for existing SHA.
      return new Response("Not Found", { status: 404 });
    });

    await publishContent({ x: 1 }, "github_pat_test");
    expect(putBody?.sha).toBeUndefined();
    expect(putBody?.message).toBeDefined();
  });

  it("re-throws non-404 errors from the SHA fetch", async () => {
    mockFetch((_url, init) => {
      if (init?.method === "PUT") return jsonResponse({});
      return new Response("Server boom", { status: 500 });
    });
    await expect(publishContent({}, "github_pat_test")).rejects.toThrow(/GitHub 500/);
  });

  it("preserves unicode characters in the committed JSON", async () => {
    let putBody: Record<string, string> | undefined;
    mockFetch((_url, init) => {
      if (init?.method === "PUT") {
        putBody = JSON.parse(init.body as string);
        return jsonResponse({ commit: { html_url: "" } });
      }
      return jsonResponse({ sha: "abc" });
    });

    const content = { greeting: "Hi 💗 I'm Lailah", emoji: "🍪", quote: "“gooey”" };
    await publishContent(content, "github_pat_test");

    // Decode the base64 we sent, parse it back, and check it round-trips.
    const bytes = Uint8Array.from(atob(putBody!.content), (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    expect(JSON.parse(decoded.trim())).toEqual(content);
  });
});
