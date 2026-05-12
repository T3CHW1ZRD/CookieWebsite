import { useRef } from "react";
import { Upload, Link2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (next: string) => void;
};

// Reads a file as a data URL so it can be embedded directly into content.json.
// Good enough for small images. For lots of large photos, owner should host
// elsewhere (Imgur, Cloudinary free tier) and paste the URL.
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageInput({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      alert("Image is over 2 MB — please use a smaller file or paste a hosted URL instead.");
      return;
    }
    const url = await fileToDataUrl(f);
    onChange(url);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL"
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-secondary"
        >
          <Upload size={14} /> Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          className="hidden"
        />
      </div>
      {value && (
        <img
          src={value}
          alt=""
          className="h-24 w-24 rounded-lg object-cover border border-border"
        />
      )}
    </div>
  );
}
