import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PricingEditor from "./PricingEditor";
import { ContentProvider } from "../lib/store";

const ADMIN_SESSION_KEY = "lailahs.admin.session";

function renderEditor() {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  return render(
    <ContentProvider>
      <PricingEditor />
    </ContentProvider>
  );
}

const getCards = () => screen.getAllByRole("article");

beforeEach(() => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

describe("PricingEditor", () => {
  it("renders all seeded pricing tiers", () => {
    renderEditor();
    expect(screen.getByDisplayValue("Box of 4")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Half-dozen")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dozen")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$20")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$60")).toBeInTheDocument();
  });

  it("ADD creates a new tier", async () => {
    const user = userEvent.setup();
    renderEditor();
    const before = getCards().length;
    await user.click(screen.getByRole("button", { name: /add tier/i }));
    expect(getCards()).toHaveLength(before + 1);
    expect(screen.getByDisplayValue("New tier")).toBeInTheDocument();
  });

  it("EDIT updates label, size, and price independently", async () => {
    const user = userEvent.setup();
    renderEditor();

    const labelInput = screen.getByDisplayValue("Box of 4");
    await user.clear(labelInput);
    await user.type(labelInput, "Sampler");
    expect(screen.getByDisplayValue("Sampler")).toBeInTheDocument();

    const priceInput = screen.getByDisplayValue("$20");
    await user.clear(priceInput);
    await user.type(priceInput, "$18");
    expect(screen.getByDisplayValue("$18")).toBeInTheDocument();
  });

  it("DELETE removes a tier (after confirm)", async () => {
    const user = userEvent.setup();
    renderEditor();
    const before = getCards().length;
    await user.click(within(getCards()[0]).getByTitle(/delete/i));
    expect(getCards()).toHaveLength(before - 1);
    expect(screen.queryByDisplayValue("Box of 4")).not.toBeInTheDocument();
  });

  it("MOVE DOWN swaps positions", async () => {
    const user = userEvent.setup();
    renderEditor();
    await user.click(within(getCards()[0]).getByTitle(/move down/i));
    expect(within(getCards()[0]).getByDisplayValue("Half-dozen")).toBeInTheDocument();
    expect(within(getCards()[1]).getByDisplayValue("Box of 4")).toBeInTheDocument();
  });

  it("MOVE UP swaps positions", async () => {
    const user = userEvent.setup();
    renderEditor();
    await user.click(within(getCards()[2]).getByTitle(/move up/i));
    expect(within(getCards()[1]).getByDisplayValue("Dozen")).toBeInTheDocument();
    expect(within(getCards()[2]).getByDisplayValue("Half-dozen")).toBeInTheDocument();
  });

  it("shows an empty-state message and hides cards when all tiers are deleted", async () => {
    const user = userEvent.setup();
    renderEditor();
    // Delete all three tiers.
    while (screen.queryAllByRole("article").length > 0) {
      await user.click(within(getCards()[0]).getByTitle(/delete/i));
    }
    expect(screen.getByText(/no pricing tiers yet/i)).toBeInTheDocument();
  });
});
