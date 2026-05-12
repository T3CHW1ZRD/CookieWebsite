import { useContent } from "../lib/store";
import type { ShopInfo } from "../types";

type FieldKey =
  | "brandName"
  | "tagline"
  | "heroHeadline"
  | "heroSubcopy"
  | "address"
  | "hours"
  | "phone"
  | "email"
  | "orderUrl";

const FIELDS: { key: FieldKey; label: string; multiline?: boolean }[] = [
  { key: "brandName", label: "Brand name" },
  { key: "tagline", label: "Tagline (short, scripty)" },
  { key: "heroHeadline", label: "Hero headline" },
  { key: "heroSubcopy", label: "Hero subcopy", multiline: true },
  { key: "address", label: "Address" },
  { key: "hours", label: "Hours" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "orderUrl", label: "Order / shop URL" },
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
        <h2 className="font-display text-2xl mb-4">Shop details</h2>
        <div className="space-y-4">
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="block text-sm font-medium mb-1">{f.label}</span>
              {f.multiline ? (
                <textarea
                  rows={3}
                  value={content.shop[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <input
                  value={content.shop[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              )}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl mb-4">Socials</h2>
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
        <p className="mt-6 text-xs text-muted-foreground">
          Leave any social blank to hide its button on the site.
        </p>
      </section>
    </div>
  );
}
