import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GalleryEditor from "./GalleryEditor";
import { ContentProvider } from "../lib/store";

const ADMIN_SESSION_KEY = "lailahs.admin.session";

function renderEditor() {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  return render(
    <ContentProvider>
      <GalleryEditor />
    </ContentProvider>
  );
}

const getCards = () => screen.getAllByRole("article");

beforeEach(() => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

describe("GalleryEditor", () => {
  it("renders all seeded gallery captions", () => {
    renderEditor();
    expect(screen.getByDisplayValue("Classic Chocolate Chip")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Box: White Chocolate Macadamia + Classic Chocolate Chip")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("S'mores")).toBeInTheDocument();
  });

  it("ADD appends a new empty entry", async () => {
    const user = userEvent.setup();
    renderEditor();
    const before = getCards().length;
    await user.click(screen.getByRole("button", { name: /add photo/i }));
    expect(getCards()).toHaveLength(before + 1);
  });

  it("EDIT caption updates the value in place", async () => {
    const user = userEvent.setup();
    renderEditor();
    const captionInput = screen.getByDisplayValue("Classic Chocolate Chip");
    await user.clear(captionInput);
    await user.type(captionInput, "Updated caption");
    expect(screen.getByDisplayValue("Updated caption")).toBeInTheDocument();
  });

  it("EDIT image URL via the URL input updates the preview src", async () => {
    const user = userEvent.setup();
    renderEditor();
    const card = getCards()[0];
    const urlInput = within(card).getByPlaceholderText(/paste image url/i);
    await user.clear(urlInput);
    await user.type(urlInput, "https://example.com/cookie.png");
    // The preview <img alt=""> is decorative, so RTL's role queries skip it.
    // Query by selector instead.
    const preview = card.querySelector("img");
    expect(preview).not.toBeNull();
    expect(preview).toHaveAttribute("src", "https://example.com/cookie.png");
  });

  it("DELETE removes a gallery entry", async () => {
    const user = userEvent.setup();
    renderEditor();
    const before = getCards().length;
    await user.click(within(getCards()[0]).getAllByRole("button").pop()!); // last btn = trash
    expect(getCards()).toHaveLength(before - 1);
  });

  it("MOVE DOWN reorders entries", async () => {
    const user = userEvent.setup();
    renderEditor();
    const firstCaption = within(getCards()[0]).getByRole("textbox", {
      name: /caption/i,
    }) as HTMLInputElement;
    const originalFirst = firstCaption.value;

    // Click the move-down button (second button in the row of action buttons).
    const buttons = within(getCards()[0]).getAllByRole("button");
    // Order in component: up, down, delete.
    await user.click(buttons[buttons.length - 2]);

    // The first card now holds a different caption.
    const newFirstCaption = within(getCards()[0]).getByRole("textbox", {
      name: /caption/i,
    }) as HTMLInputElement;
    expect(newFirstCaption.value).not.toBe(originalFirst);
  });

  it("MOVE UP is disabled on the first card", () => {
    renderEditor();
    const buttons = within(getCards()[0]).getAllByRole("button");
    // Order in component: up, down, delete; but Upload is also a button.
    // The action row buttons are the last 3.
    const actionButtons = buttons.slice(-3);
    expect(actionButtons[0]).toBeDisabled();
  });
});
