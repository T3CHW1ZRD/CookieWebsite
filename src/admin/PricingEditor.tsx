import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useContent } from "../lib/store";
import type { PricingTier } from "../types";

function newId() {
  return "p" + Math.random().toString(36).slice(2, 9);
}

export default function PricingEditor() {
  const { content, setContent } = useContent();
  const tiers = content.pricing ?? [];

  function update(next: PricingTier[]) {
    setContent({ ...content, pricing: next });
  }
  function add() {
    update([...tiers, { id: newId(), label: "New tier", size: "", price: "" }]);
  }
  function patch(idx: number, patch: Partial<PricingTier>) {
    update(tiers.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  }
  function remove(idx: number) {
    if (!confirm("Delete this pricing tier?")) return;
    update(tiers.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const next = [...tiers];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    update(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Pricing tiers</h2>
          <p className="text-xs text-muted-foreground mt-1">
            The middle tier is highlighted as &ldquo;Most popular&rdquo; on the site.
          </p>
        </div>
        <button onClick={add} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Add tier
        </button>
      </div>

      {tiers.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
          No pricing tiers yet. Click <strong>Add tier</strong> to make one.
        </p>
      )}

      <div className="space-y-4">
        {tiers.map((tier, idx) => (
          <article
            key={tier.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
              <label className="block">
                <span className="block text-sm font-medium mb-1">Label</span>
                <input
                  value={tier.label}
                  onChange={(e) => patch(idx, { label: e.target.value })}
                  placeholder="Box of 4"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium mb-1">Size</span>
                <input
                  value={tier.size}
                  onChange={(e) => patch(idx, { size: e.target.value })}
                  placeholder="4 cookies"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium mb-1">Price</span>
                <input
                  value={tier.price}
                  onChange={(e) => patch(idx, { price: e.target.value })}
                  placeholder="$20"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="flex md:flex-col gap-2 justify-end">
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="rounded-lg border border-border bg-background p-2 disabled:opacity-30 hover:bg-secondary"
                  title="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === tiers.length - 1}
                  className="rounded-lg border border-border bg-background p-2 disabled:opacity-30 hover:bg-secondary"
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => remove(idx)}
                  className="rounded-lg border border-border bg-background p-2 text-primary hover:bg-primary hover:text-primary-foreground"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
