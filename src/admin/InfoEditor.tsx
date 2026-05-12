import { useContent } from "../lib/store";
import type { ShopInfo } from "../types";

type FieldKey =
  | "brandName"
  | "tagline"
  | "heroHeadline"
  | "heroSubcopy"
  | "aboutBody"
  | "noticeWindow"
  | "fulfillment"
  | "allergens"
  | "orderUrl";

const FIELDS: { key: FieldKey; label: string; hint?: string; multiline?: boolean }[] = [
  { key: "brandName", label: "Brand name", hint: "Shown in the nav and footer." },
  {
    key: "tagline",
    label: "Tagline",
    hint: "The little script line above the headline. Short.",
  },
  { key: "heroHeadline", label: "Hero headline", hint: "The big line at the top." },
  {
    key: "heroSubcopy",
    label: "Hero subcopy",
    hint: "One or two sentences under the headline.",
    multiline: true,
  },
  {
    key: "aboutBody",
    label: "About / your story",
    hint: "The paragraph in the About section.",
    multiline: true,
  },
  {
    key: "noticeWindow",
    label: "Notice window",
    hint: "How far in advance orders should be placed.",
  },
  {
    key: "fulfillment",
    label: "Pickup / delivery info",
    hint: "Shown in the Pricing and Order sections.",
  },
  {
    key: "allergens",
    label: "Ingredients & allergens",
    hint: "Allergen disclosure shown in the Order section.",
    multiline: true,
  },
  { key: "orderUrl", label: "Order link (Instagram URL)", hint: "Where the Order button takes visitors." },
];

const SOCIALS: { key: keyof ShopInfo["socials"]; label: string }[] = [
  { key: "instagram", label: "Instagram URL" },
  { key: "tiktok", label: "TikTok URL" },
  { key: "facebook", label: "Facebook URL" },
  { key: "twitter", label: "Twitter / X URL" },
];

export default function InfoEditor() {
  const { content, setContent } = useContent();

  function update<K extends FieldKey>(key: K, value: string) {
    setContent({ ...content, shop: { ...content.shop, [key]: value } });
  }
  function updateSocial(key: keyof ShopInfo["socials"], value: string) {
    setContent({
      ...content,
      shop: { ...content.shop, socials: { ...content.shop.socials, [key]: value } },
    });
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl mb-1">Shop details</h2>
        <p className="text-xs text-muted-foreground mb-5">
          The text that shows up throughout the site.
        </p>
        <div className="space-y-4">
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="block text-sm font-medium">{f.label}</span>
              {f.hint && (
                <span className="block text-xs text-muted-foreground mb-1.5">{f.hint}</span>
              )}
              {f.multiline ? (
                <textarea
                  rows={f.key === "aboutBody" ? 6 : 3}
                  value={content.shop[f.key] ?? ""}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <input
                  value={content.shop[f.key] ?? ""}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              )}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 h-fit">
        <h2 className="font-display text-2xl mb-1">Socials</h2>
        <p className="text-xs text-muted-foreground mb-5">
          Leave any blank to hide its icon on the site.
        </p>
        <div className="space-y-4">
          {SOCIALS.map((s) => (
            <label key={s.key} className="block">
              <span className="block text-sm font-medium mb-1">{s.label}</span>
              <input
                value={content.shop.socials[s.key] ?? ""}
                onChange={(e) => updateSocial(s.key, e.target.value)}
                placeholder="https://"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
