// Contract tests: every field that an editor lets Lailah set must appear
// on the public site. These prove that her edits actually do something
// visible to visitors, not just sit in localStorage forever.
//
// If we add an input to an editor but forget to render the matching
// field in the public component, these tests fail. That's how we
// catch the "menu image input did nothing" class of bug before deploy.

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContentProvider } from "../lib/store";
import MenuEditor from "../admin/MenuEditor";
import PricingEditor from "../admin/PricingEditor";
import GalleryEditor from "../admin/GalleryEditor";
import InfoEditor from "../admin/InfoEditor";
import Menu from "../components/Menu";
import Pricing from "../components/Pricing";
import Gallery from "../components/Gallery";
import About from "../components/About";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Contact from "../components/Contact";

const ADMIN_SESSION_KEY = "lailahs.admin.session";

beforeEach(() => {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
});

function renderPair(Editor: React.ComponentType, Public: React.ComponentType) {
  const utils = render(
    <ContentProvider>
      <div data-testid="editor">
        <Editor />
      </div>
      <div data-testid="public">
        <Public />
      </div>
    </ContentProvider>
  );
  return {
    ...utils,
    editor: () => screen.getByTestId("editor"),
    pub: () => screen.getByTestId("public"),
  };
}

function inputForEditorLabel(scope: HTMLElement, labelText: string) {
  const labelSpan = within(scope).getByText(labelText);
  const wrapper = labelSpan.closest("label") as HTMLLabelElement;
  return wrapper.querySelector("input, textarea") as
    | HTMLInputElement
    | HTMLTextAreaElement;
}

describe("contract: Menu editor ↔ Menu public component", () => {
  it("editing a flavour name shows the new name on the menu", async () => {
    const user = userEvent.setup();
    const { pub } = renderPair(MenuEditor, Menu);

    const input = screen.getByDisplayValue("Classic Chocolate Chip");
    await user.clear(input);
    await user.type(input, "Brown Butter Chip");

    const headings = within(pub()).getAllByRole("heading", { level: 3 });
    const names = headings.map((h) => h.textContent);
    expect(names).toContain("Brown Butter Chip");
    expect(names).not.toContain("Classic Chocolate Chip");
  });

  it("editing a flavour description shows the new description on the menu", async () => {
    const user = userEvent.setup();
    const { editor, pub } = renderPair(MenuEditor, Menu);

    const textareas = within(editor())
      .getAllByRole("textbox")
      .filter((el) => el.tagName === "TEXTAREA");
    const descEl = textareas[0] as HTMLTextAreaElement;
    await user.clear(descEl);
    await user.type(descEl, "Brand new test description text.");

    expect(within(pub()).getByText("Brand new test description text.")).toBeInTheDocument();
  });

  it("the Flavours editor exposes ONLY fields that the public menu displays", () => {
    const { editor } = renderPair(MenuEditor, Menu);
    const firstCard = within(editor()).getAllByRole("article")[0];
    const inputs = within(firstCard).getAllByRole("textbox");
    // Exactly two fields: a name <input> and a description <textarea>.
    // If a third input lands here without a matching public render, this
    // test should be revisited.
    expect(inputs.map((el) => el.tagName).sort()).toEqual(["INPUT", "TEXTAREA"]);
  });
});

describe("contract: Pricing editor ↔ Pricing public component", () => {
  it("editing a tier label propagates to the public pricing card", async () => {
    const user = userEvent.setup();
    const { pub } = renderPair(PricingEditor, Pricing);

    const labelInput = screen.getByDisplayValue("Box of 4");
    await user.clear(labelInput);
    await user.type(labelInput, "Sampler Pack");

    expect(within(pub()).getByText(/sampler pack/i)).toBeInTheDocument();
  });

  it("editing a tier price propagates", async () => {
    const user = userEvent.setup();
    const { pub } = renderPair(PricingEditor, Pricing);

    const priceInput = screen.getByDisplayValue("$20");
    await user.clear(priceInput);
    await user.type(priceInput, "$25");

    expect(within(pub()).getByText("$25")).toBeInTheDocument();
  });

  it("editing a tier size propagates", async () => {
    const user = userEvent.setup();
    const { pub } = renderPair(PricingEditor, Pricing);

    const sizeInput = screen.getByDisplayValue("4 cookies");
    await user.clear(sizeInput);
    await user.type(sizeInput, "4 jumbos");

    expect(within(pub()).getByText("4 jumbos")).toBeInTheDocument();
  });
});

describe("contract: Gallery editor ↔ Gallery public component", () => {
  it("editing a caption propagates to the public gallery", async () => {
    const user = userEvent.setup();
    const { editor, pub } = renderPair(GalleryEditor, Gallery);

    // First caption input inside the editor.
    const captionInput = within(editor())
      .getByDisplayValue("Classic Chocolate Chip");
    await user.clear(captionInput);
    await user.type(captionInput, "Updated public caption");

    // Public Gallery renders the caption in the overlay.
    expect(within(pub()).getByText("Updated public caption")).toBeInTheDocument();
  });

  it("editing an image URL propagates to the public gallery <img src>", async () => {
    const user = userEvent.setup();
    const { editor, pub } = renderPair(GalleryEditor, Gallery);

    const firstEditorCard = within(editor()).getAllByRole("article")[0];
    const urlInput = within(firstEditorCard).getByPlaceholderText(/paste image url/i);

    await user.clear(urlInput);
    await user.type(urlInput, "https://example.com/new-cookie.png");

    const publicImgs = pub().querySelectorAll(
      'img[src="https://example.com/new-cookie.png"]'
    );
    expect(publicImgs.length).toBeGreaterThan(0);
  });
});

describe("contract: Info editor ↔ public components", () => {
  it("editing the brand name updates Footer", async () => {
    const user = userEvent.setup();
    const { editor, pub } = renderPair(InfoEditor, Footer);

    const input = inputForEditorLabel(editor(), "Brand name");
    await user.clear(input);
    await user.type(input, "Lailah's Test Cookies");

    // Footer renders the brand twice (logo wordmark + copyright line).
    expect(within(pub()).getAllByText(/Lailah's Test Cookies/).length).toBeGreaterThan(0);
  });

  it("editing tagline + hero headline updates Hero", async () => {
    const user = userEvent.setup();
    const { editor, pub } = renderPair(InfoEditor, Hero);

    const tagline = inputForEditorLabel(editor(), "Tagline") as HTMLInputElement;
    await user.clear(tagline);
    await user.type(tagline, "test tagline goes here");

    const headline = inputForEditorLabel(editor(), "Hero headline") as HTMLInputElement;
    await user.clear(headline);
    await user.type(headline, "Test Headline");

    expect(within(pub()).getByText("test tagline goes here")).toBeInTheDocument();
    expect(within(pub()).getByText("Test Headline")).toBeInTheDocument();
  });

  it("editing the about-body updates the About section", async () => {
    const user = userEvent.setup();
    const { editor, pub } = renderPair(InfoEditor, About);

    const aboutTextarea = inputForEditorLabel(
      editor(),
      "About / your story"
    ) as HTMLTextAreaElement;
    await user.clear(aboutTextarea);
    await user.type(aboutTextarea, "A brand new about body for testing.");

    expect(within(pub()).getByText("A brand new about body for testing.")).toBeInTheDocument();
  });

  it("editing allergens + fulfillment + noticeWindow updates Contact", async () => {
    const user = userEvent.setup();
    const { editor, pub } = renderPair(InfoEditor, Contact);

    const allergens = inputForEditorLabel(editor(), "Ingredients & allergens") as HTMLTextAreaElement;
    await user.clear(allergens);
    await user.type(allergens, "Contains test ingredients.");

    const fulfillment = inputForEditorLabel(editor(), "Pickup / delivery info") as HTMLInputElement;
    await user.clear(fulfillment);
    await user.type(fulfillment, "Pickup only.");

    const notice = inputForEditorLabel(editor(), "Notice window") as HTMLInputElement;
    await user.clear(notice);
    await user.type(notice, "Two weeks notice");

    expect(within(pub()).getByText("Contains test ingredients.")).toBeInTheDocument();
    expect(within(pub()).getByText("Pickup only.")).toBeInTheDocument();
    expect(within(pub()).getByText("Two weeks notice")).toBeInTheDocument();
  });

  it("editing the Instagram URL updates Footer's social link", async () => {
    const user = userEvent.setup();
    const { editor, pub } = renderPair(InfoEditor, Footer);

    const ig = inputForEditorLabel(editor(), "Instagram URL") as HTMLInputElement;
    await user.clear(ig);
    await user.type(ig, "https://instagram.com/test-handle");

    const link = within(pub()).getByLabelText(/instagram/i);
    expect(link).toHaveAttribute("href", "https://instagram.com/test-handle");
  });
});
