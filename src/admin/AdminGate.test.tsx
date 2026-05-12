import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createHash } from "node:crypto";
import AdminGate, { SESSION_KEY } from "./AdminGate";

const CORRECT_PASSWORD = "Lailah-2022-we8fh98h9823hg23";
const EXPECTED_HASH = "c9be8320fcf88bbc5366be97d00afc106dd8751a1136e4491550367fe9f3090a";

describe("AdminGate — password hashing", () => {
  it("the committed hash matches the intended password", () => {
    const hash = createHash("sha256").update(CORRECT_PASSWORD).digest("hex");
    expect(hash).toBe(EXPECTED_HASH);
  });

  it("any other password produces a different hash", () => {
    const wrongs = [
      "Lailah-2022-we8fh98h9823hg22", // off by one char
      "lailah-2022-we8fh98h9823hg23", // wrong case
      "Lailah-2022-we8fh98h9823hg23 ", // trailing space
      "",
      "password",
      "admin",
    ];
    for (const p of wrongs) {
      const h = createHash("sha256").update(p).digest("hex");
      expect(h).not.toBe(EXPECTED_HASH);
    }
  });
});

describe("AdminGate — login flow", () => {
  it("shows the password form when not unlocked", () => {
    render(
      <AdminGate>
        <div data-testid="protected">secret content</div>
      </AdminGate>
    );
    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Owner login")).toBeInTheDocument();
  });

  it("unlocks with the correct password and renders children", async () => {
    const user = userEvent.setup();
    render(
      <AdminGate>
        <div data-testid="protected">secret content</div>
      </AdminGate>
    );

    const input = screen.getByPlaceholderText("••••••••");
    await user.type(input, CORRECT_PASSWORD);
    await user.click(screen.getByRole("button", { name: /unlock/i }));

    expect(await screen.findByTestId("protected")).toBeInTheDocument();
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBe("1");
  });

  it("rejects the wrong password and shows an error", async () => {
    const user = userEvent.setup();
    render(
      <AdminGate>
        <div data-testid="protected">secret content</div>
      </AdminGate>
    );

    await user.type(screen.getByPlaceholderText("••••••••"), "obviously-wrong");
    await user.click(screen.getByRole("button", { name: /unlock/i }));

    expect(await screen.findByText("Wrong password.")).toBeInTheDocument();
    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("skips the form when sessionStorage already has the unlock flag", () => {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    render(
      <AdminGate>
        <div data-testid="protected">secret content</div>
      </AdminGate>
    );
    expect(screen.getByTestId("protected")).toBeInTheDocument();
    expect(screen.queryByText("Owner login")).not.toBeInTheDocument();
  });

  it("rejects a tampered sessionStorage value", () => {
    window.sessionStorage.setItem(SESSION_KEY, "yes");
    render(
      <AdminGate>
        <div data-testid="protected">secret content</div>
      </AdminGate>
    );
    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("clears the error message when the user edits the input again", async () => {
    const user = userEvent.setup();
    render(
      <AdminGate>
        <div>x</div>
      </AdminGate>
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await user.click(screen.getByRole("button", { name: /unlock/i }));
    expect(await screen.findByText("Wrong password.")).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText("••••••••"), "x");
    expect(screen.queryByText("Wrong password.")).not.toBeInTheDocument();
  });
});
