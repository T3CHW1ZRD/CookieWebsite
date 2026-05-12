import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InfoEditor from "./InfoEditor";
import { ContentProvider } from "../lib/store";

const ADMIN_SESSION_KEY = "lailahs.admin.session";

function renderEditor() {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  return render(
    <ContentProvider>
      <InfoEditor />
    </ContentProvider>
  );
}

// Looks up the form input that sits inside the <label> containing the given
// label text. Uses parent traversal because the editor doesn't use
// htmlFor/id pairing for its labels.
function inputForLabel(labelText: string | RegExp): HTMLInputElement | HTMLTextAreaElement {
  const labelSpan = screen.getByText(labelText);
  const wrapper = labelSpan.closest("label") as HTMLLabelElement;
  const el = wrapper.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement;
  return el;
}

describe("InfoEditor — shop fields", () => {
  it("renders seeded brand name and tagline", () => {
    renderEditor();
    expect(inputForLabel("Brand name")).toHaveValue("Lailah's Cookies");
    expect(inputForLabel("Tagline")).toHaveValue("made fresh to order, with love.");
  });

  it("EDIT brand name updates the value", async () => {
    const user = userEvent.setup();
    renderEditor();
    const input = inputForLabel("Brand name");
    await user.clear(input);
    await user.type(input, "Lailah's GF Cookies");
    expect(input).toHaveValue("Lailah's GF Cookies");
  });

  it("EDIT hero subcopy (multiline) updates the value", async () => {
    const user = userEvent.setup();
    renderEditor();
    const textarea = inputForLabel("Hero subcopy");
    await user.clear(textarea);
    await user.type(textarea, "Brand new subcopy.");
    expect(textarea).toHaveValue("Brand new subcopy.");
  });

  it("EDIT order URL updates", async () => {
    const user = userEvent.setup();
    renderEditor();
    const input = inputForLabel("Order link (Instagram URL)");
    await user.clear(input);
    await user.type(input, "https://example.com/order");
    expect(input).toHaveValue("https://example.com/order");
  });

  it("EDIT about-body keeps newlines (textarea, 6 rows)", async () => {
    const user = userEvent.setup();
    renderEditor();
    const textarea = inputForLabel("About / your story") as HTMLTextAreaElement;
    await user.clear(textarea);
    await user.type(textarea, "Hello{Enter}World");
    expect(textarea.value).toBe("Hello\nWorld");
  });
});

describe("InfoEditor — socials", () => {
  it("renders all four social URL inputs", () => {
    renderEditor();
    expect(screen.getByText("Instagram URL")).toBeInTheDocument();
    expect(screen.getByText("TikTok URL")).toBeInTheDocument();
    expect(screen.getByText("Facebook URL")).toBeInTheDocument();
    expect(screen.getByText("Twitter / X URL")).toBeInTheDocument();
  });

  it("EDIT Instagram URL persists the value", async () => {
    const user = userEvent.setup();
    renderEditor();
    const ig = inputForLabel("Instagram URL");
    await user.clear(ig);
    await user.type(ig, "https://www.instagram.com/test");
    expect(ig).toHaveValue("https://www.instagram.com/test");
  });

  it("EDIT a blank social field accepts text input", async () => {
    const user = userEvent.setup();
    renderEditor();
    const input = inputForLabel("Facebook URL");
    expect(input).toHaveValue("");
    await user.type(input, "https://facebook.com/lailahs");
    expect(input).toHaveValue("https://facebook.com/lailahs");
  });
});
