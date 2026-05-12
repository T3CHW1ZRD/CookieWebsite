import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useContent } from "../lib/store";
import type { MenuItem } from "../types";
import ImageInput from "./ImageInput";

function newId() {
  return "m" + Math.random().toString(36).slice(2, 9);
}

export default function MenuEditor() {
  const { content, setContent } = useContent();

  function update(items: MenuItem[]) {
    setContent({ ...content, menu: items });
  }
  function add() {
    update([
      ...content.menu,
      {
        id: newId(),
        name: "New cookie",
        description: "",
        image: "",
      },
    ]);
  }
  function patch(idx: number, patch: Partial<MenuItem>) {
    update(content.menu.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  }
  function remove(idx: number) {
    if (!confirm("Delete this menu item?")) return;
    update(content.menu.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const next = [...content.menu];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    update(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Menu items</h2>
        <button onClick={add} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Add item
        </button>
      </div>

      {content.menu.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
          No menu items yet. Click <strong>Add item</strong> to create your first one.
        </p>
      )}

      <div className="space-y-4">
        {content.menu.map((item, idx) => (
          <article
            key={item.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="grid md:grid-cols-[1fr_2fr_auto] gap-5">
              <div>
                <span className="block text-sm font-medium mb-1">Image</span>
                <ImageInput value={item.image} onChange={(v) => patch(idx, { image: v })} />
              </div>
              <div className="space-y-3">
                <label className="block">
                  <span className="block text-sm font-medium mb-1">Name</span>
                  <input
                    value={item.name}
                    onChange={(e) => patch(idx, { name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-1">Description</span>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => patch(idx, { description: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-1">
                    Tag (optional — e.g. &ldquo;Bestseller&rdquo;, &ldquo;New&rdquo;)
                  </span>
                  <input
                    value={item.tag ?? ""}
                    onChange={(e) => patch(idx, { tag: e.target.value || undefined })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>
              <div className="flex md:flex-col gap-2 md:justify-start justify-end">
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
                  disabled={idx === content.menu.length - 1}
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
