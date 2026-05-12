import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PublishPanel from "./PublishPanel";
import { ContentProvider } from "../lib/store";

// Mock the github module so tests don't talk to the real GitHub API.
vi.mock("../lib/github", () => ({
  REPO: { owner: "TestOwner", repo: "TestRepo", branch: "main" },
  loadToken: vi.fn(() => ""),
  saveToken: vi.fn(),
  clearToken: vi.fn(),
  verifyAccess: vi.fn(),
  publishContent: vi.fn(),
}));

import * as github from "../lib/github";

const ADMIN_SESSION_KEY = "lailahs.admin.session";

function renderPanel() {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  return render(
    <ContentProvider>
      <PublishPanel />
    </ContentProvider>
  );
}

beforeEach(() => {
  vi.mocked(github.loadToken).mockReturnValue("");
  vi.mocked(github.saveToken).mockReset();
  vi.mocked(github.verifyAccess).mockReset();
  vi.mocked(github.publishContent).mockReset();
});

describe("PublishPanel — UI basics", () => {
  it("renders the connected repo info from REPO config", () => {
    renderPanel();
    // The exact format is "owner/repo".
    expect(screen.getByText(/TestOwner\/TestRepo/)).toBeInTheDocument();
    expect(screen.getByText(/branch/)).toBeInTheDocument();
  });

  it("renders Test connection, Publish, and Download backup buttons", () => {
    renderPanel();
    expect(screen.getByRole("button", { name: /test connection/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^publish$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download backup/i })).toBeInTheDocument();
  });

  it("the token input is masked by default and toggles visibility", async () => {
    const user = userEvent.setup();
    renderPanel();
    const input = screen.getByPlaceholderText(/github_pat_/i) as HTMLInputElement;
    expect(input.type).toBe("password");
    const eye = screen.getByLabelText(/show token/i);
    await user.click(eye);
    expect(input.type).toBe("text");
  });

  it("pre-fills the token from loadToken on mount", () => {
    vi.mocked(github.loadToken).mockReturnValue("github_pat_prefilled");
    renderPanel();
    const input = screen.getByPlaceholderText(/github_pat_/i) as HTMLInputElement;
    expect(input.value).toBe("github_pat_prefilled");
  });
});

describe("PublishPanel — token handling", () => {
  it("saveToken is called every time the user types", async () => {
    const user = userEvent.setup();
    renderPanel();
    const input = screen.getByPlaceholderText(/github_pat_/i);
    await user.type(input, "abc");
    // userEvent.type fires one input event per character.
    expect(github.saveToken).toHaveBeenCalledTimes(3);
    expect(github.saveToken).toHaveBeenLastCalledWith("abc");
  });

  it("Test connection without a token shows an error and does not call verifyAccess", async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole("button", { name: /test connection/i }));
    expect(github.verifyAccess).not.toHaveBeenCalled();
    expect(await screen.findByText(/Paste your access token first/i)).toBeInTheDocument();
  });

  it("Publish without a token shows an error and does not call publishContent", async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole("button", { name: /^publish$/i }));
    expect(github.publishContent).not.toHaveBeenCalled();
    expect(await screen.findByText(/Paste your access token first/i)).toBeInTheDocument();
  });
});

describe("PublishPanel — Test connection", () => {
  it("calls verifyAccess with the typed token and shows success", async () => {
    const user = userEvent.setup();
    vi.mocked(github.verifyAccess).mockResolvedValue({ login: "T3CHW1ZRD" });

    renderPanel();
    await user.type(screen.getByPlaceholderText(/github_pat_/i), "github_pat_test");
    await user.click(screen.getByRole("button", { name: /test connection/i }));

    await waitFor(() => {
      expect(github.verifyAccess).toHaveBeenCalledWith("github_pat_test");
    });
    // "Connected as ..." is unique to the success banner; the sidebar uses
    // "Ready to publish" as instruction text so we avoid that as a probe.
    expect(await screen.findByText(/Connected as/i)).toBeInTheDocument();
    expect(screen.getByText("T3CHW1ZRD")).toBeInTheDocument();
  });

  it("shows an error when verifyAccess rejects", async () => {
    const user = userEvent.setup();
    vi.mocked(github.verifyAccess).mockRejectedValue(new Error("GitHub 401: Bad creds"));

    renderPanel();
    await user.type(screen.getByPlaceholderText(/github_pat_/i), "bad");
    await user.click(screen.getByRole("button", { name: /test connection/i }));

    // The error message we threw is unique to the failure state, so we probe
    // for that rather than the heading (which uses a curly apostrophe).
    expect(await screen.findByText(/GitHub 401: Bad creds/i)).toBeInTheDocument();
  });
});

describe("PublishPanel — Publish button", () => {
  it("calls publishContent with current content and the typed token", async () => {
    const user = userEvent.setup();
    vi.mocked(github.publishContent).mockResolvedValue({
      commitUrl: "https://example/commit/abc",
    });

    renderPanel();
    await user.type(screen.getByPlaceholderText(/github_pat_/i), "github_pat_xyz");
    await user.click(screen.getByRole("button", { name: /^publish$/i }));

    await waitFor(() => {
      expect(github.publishContent).toHaveBeenCalledTimes(1);
    });
    const [contentArg, tokenArg] = vi.mocked(github.publishContent).mock.calls[0];
    expect(tokenArg).toBe("github_pat_xyz");
    // Content arg should look like a SiteContent — minimally a `menu` array.
    expect(contentArg).toHaveProperty("menu");
    expect(contentArg).toHaveProperty("shop");
  });

  it("shows the success state with a commit link", async () => {
    const user = userEvent.setup();
    vi.mocked(github.publishContent).mockResolvedValue({
      commitUrl: "https://github.com/x/y/commit/abc123",
    });

    renderPanel();
    await user.type(screen.getByPlaceholderText(/github_pat_/i), "tok");
    await user.click(screen.getByRole("button", { name: /^publish$/i }));

    expect(await screen.findByText(/Published!/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /view commit/i });
    expect(link).toHaveAttribute("href", "https://github.com/x/y/commit/abc123");
  });

  it("shows error state when publishContent rejects", async () => {
    const user = userEvent.setup();
    vi.mocked(github.publishContent).mockRejectedValue(new Error("GitHub 403: forbidden"));

    renderPanel();
    await user.type(screen.getByPlaceholderText(/github_pat_/i), "tok");
    await user.click(screen.getByRole("button", { name: /^publish$/i }));

    expect(await screen.findByText(/GitHub 403: forbidden/i)).toBeInTheDocument();
  });
});
