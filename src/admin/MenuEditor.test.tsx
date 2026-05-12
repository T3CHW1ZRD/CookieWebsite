import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuEditor from "./MenuEditor";
import { ContentProvider } from "../lib/store";

const ADMIN_SESSION_KEY = "lailahs.admin.session";

function renderEditor() {
  // Mark this browser as an admin session so the store actually persists edits.
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  return render(
    <ContentProvider>
      <MenuEditor />
    </ContentProvider>
  );
}

function getCards() {
  return screen.getAllByRole("article");
}

beforeEach(() => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

describe("MenuEditor", () => {
  it("renders all seeded flavours", () => {
    renderEditor();
    expect(screen.getByDisplayValue("Classic Chocolate Chip")).toBeInTheDocument();
    expect(screen.getByDisplayValue("White Chocolate Macadamia")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Caramel Crunch Shortbread")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Salted Sticky Date")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Stuffed Pistachio")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Stuffed Strawberry Cheesecake")).toBeInTheDocument();
  });

  it("ADD creates a new flavour at the end of the list", async () => {
    const user = userEvent.setup();
    renderEditor();
    const initialCount = getCards().length;

    await user.click(screen.getByRole("button", { name: /add item/i }));
    expect(getCards()).toHaveLength(initialCount + 1);
    expect(screen.getByDisplayValue("New cookie")).toBeInTheDocument();
  });

  it("EDIT updates the flavour name and description", async () => {
    const user = userEvent.setup();
    renderEditor();

    const nameInput = screen.getByDisplayValue("Classic Chocolate Chip");
    await user.clear(nameInput);
    await user.type(nameInput, "Brown Butter Chip");

    expect(screen.getByDisplayValue("Brown Butter Chip")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Classic Chocolate Chip")).not.toBeInTheDocument();
  });

  it("DELETE removes a flavour (after confirm)", async () => {
    const user = userEvent.setup();
    renderEditor();
    const initialCount = getCards().length;

    const card = getCards()[0];
    const deleteBtn = within(card).getByTitle(/delete/i);
    await user.click(deleteBtn);

    expect(getCards()).toHaveLength(initialCount - 1);
    expect(screen.queryByDisplayValue("Classic Chocolate Chip")).not.toBeInTheDocument();
  });

  it("DELETE is cancelled when the confirm prompt is dismissed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();
    renderEditor();
    const initialCount = getCards().length;

    await user.click(within(getCards()[0]).getByTitle(/delete/i));
    expect(getCards()).toHaveLength(initialCount);
  });

  it("MOVE DOWN swaps a flavour with the one below it", async () => {
    const user = userEvent.setup();
    renderEditor();

    const before = screen.getAllByRole("textbox").filter((el) =>
      el.tagName === "INPUT" && (el as HTMLInputElement).value.length > 0
    );
    const firstName = (before[0] as HTMLInputElement).value;
    const secondName = (before.find(
      (el) => (el as HTMLInputElement).value === "White Chocolate Macadamia"
    ) as HTMLInputElement).value;

    const firstCard = getCards()[0];
    await user.click(within(firstCard).getByTitle(/move down/i));

    // After move, card[0] should now hold what used to be the second item.
    const newFirstCard = getCards()[0];
    const newFirstName = within(newFirstCard)
      .getAllByRole("textbox")
      .find((el) => (el as HTMLInputElement).value === secondName);
    expect(newFirstName).toBeTruthy();

    const newSecondCard = getCards()[1];
    const newSecondName = within(newSecondCard)
      .getAllByRole("textbox")
      .find((el) => (el as HTMLInputElement).value === firstName);
    expect(newSecondName).toBeTruthy();
  });

  it("MOVE UP swaps a flavour with the one above it", async () => {
    const user = userEvent.setup();
    renderEditor();

    const secondCard = getCards()[1];
    const secondName =
      within(secondCard).getAllByRole("textbox").find(
        (el) => (el as HTMLInputElement).value.length > 0
      ) as HTMLInputElement;
    const valueToMove = secondName.value;

    await user.click(within(secondCard).getByTitle(/move up/i));
    const firstCard = getCards()[0];
    expect(within(firstCard).getByDisplayValue(valueToMove)).toBeInTheDocument();
  });

  it("MOVE UP is disabled on the first card", () => {
    renderEditor();
    const upBtn = within(getCards()[0]).getByTitle(/move up/i);
    expect(upBtn).toBeDisabled();
  });

  it("MOVE DOWN is disabled on the last card", () => {
    renderEditor();
    const cards = getCards();
    const downBtn = within(cards[cards.length - 1]).getByTitle(/move down/i);
    expect(downBtn).toBeDisabled();
  });
});
