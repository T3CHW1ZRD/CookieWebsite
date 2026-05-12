import { Plus, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";
import { useContent } from "../lib/store";
import type { Review } from "../types";

function newId() {
  return "r" + Math.random().toString(36).slice(2, 9);
}

export default function ReviewsEditor() {
  const { content, setContent } = useContent();

  function update(items: Review[]) {
    setContent({ ...content, reviews: items });
  }
  function add() {
    update([
      ...content.reviews,
      { id: newId(), author: "", text: "", rating: 5, date: "" },
    ]);
  }
  function patch(idx: number, patch: Partial<Review>) {
    update(content.reviews.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }
  function remove(idx: number) {
    if (!confirm("Delete this review?")) return;
    update(content.reviews.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const next = [...content.reviews];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    update(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Reviews</h2>
        <button onClick={add} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Add review
        </button>
      </div>

      {content.reviews.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
          No reviews yet. Click <strong>Add review</strong> to add one.
        </p>
      )}

      <div className="space-y-4">
        {content.reviews.map((r, idx) => (
          <article
            key={r.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="grid md:grid-cols-[2fr_1fr_auto] gap-4 items-start">
              <label className="md:row-span-2 block">
                <span className="block text-sm font-medium mb-1">Review text</span>
                <textarea
                  rows={4}
                  value={r.text}
                  onChange={(e) => patch(idx, { text: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="space-y-3">
                <label className="block">
                  <span className="block text-sm font-medium mb-1">Author</span>
                  <input
                    value={r.author}
                    onChange={(e) => patch(idx, { author: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-1">Date (optional)</span>
                  <input
                    value={r.date ?? ""}
                    onChange={(e) => patch(idx, { date: e.target.value })}
                    placeholder="Mar 2026"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <div>
                  <span className="block text-sm font-medium mb-1">Rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => patch(idx, { rating: n })}
                        aria-label={`${n} stars`}
                      >
                        <Star
                          size={22}
                          className={
                            n <= r.rating ? "fill-primary text-primary" : "text-border"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 justify-end">
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="rounded-lg border border-border bg-background p-2 disabled:opacity-30 hover:bg-secondary"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === content.reviews.length - 1}
                  className="rounded-lg border border-border bg-background p-2 disabled:opacity-30 hover:bg-secondary"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => remove(idx)}
                  className="rounded-lg border border-border bg-background p-2 text-primary hover:bg-primary hover:text-primary-foreground"
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
