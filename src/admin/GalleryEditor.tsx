import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useContent } from "../lib/store";
import type { GalleryImage } from "../types";
import ImageInput from "./ImageInput";

function newId() {
  return "g" + Math.random().toString(36).slice(2, 9);
}

export default function GalleryEditor() {
  const { content, setContent } = useContent();

  function update(items: GalleryImage[]) {
    setContent({ ...content, gallery: items });
  }
  function add() {
    update([...content.gallery, { id: newId(), src: "", caption: "" }]);
  }
  function patch(idx: number, patch: Partial<GalleryImage>) {
    update(content.gallery.map((g, i) => (i === idx ? { ...g, ...patch } : g)));
  }
  function remove(idx: number) {
    if (!confirm("Delete this image?")) return;
    update(content.gallery.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const next = [...content.gallery];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    update(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Gallery photos</h2>
        <button onClick={add} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Add photo
        </button>
      </div>

      {content.gallery.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
          No photos yet. Click <strong>Add photo</strong> to upload one.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {content.gallery.map((img, idx) => (
          <article
            key={img.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3"
          >
            <ImageInput value={img.src} onChange={(v) => patch(idx, { src: v })} />
            <label className="block">
              <span className="block text-sm font-medium mb-1">Caption (optional)</span>
              <input
                value={img.caption ?? ""}
                onChange={(e) => patch(idx, { caption: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="rounded-lg border border-border bg-background p-2 disabled:opacity-30 hover:bg-secondary"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => move(idx, 1)}
                disabled={idx === content.gallery.length - 1}
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
          </article>
        ))}
      </div>
    </div>
  );
}
