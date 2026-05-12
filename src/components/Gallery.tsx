import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Reveal from "./Reveal";
import { useContent } from "../lib/store";

export default function Gallery() {
  const { content } = useContent();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight")
        setActive((i) => (i === null ? 0 : (i + 1) % content.gallery.length));
      if (e.key === "ArrowLeft")
        setActive((i) =>
          i === null ? 0 : (i - 1 + content.gallery.length) % content.gallery.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, content.gallery.length]);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-muted/40">
      <div className="container-page">
        <div className="max-w-2xl mb-12">
          <Reveal variant="left">
            <p className="font-script text-2xl text-primary mb-2">the gallery</p>
            <h2 className="text-4xl md:text-5xl">Look, then taste.</h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {content.gallery.map((img, i) => {
            const variant: "left" | "up" | "right" =
              i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : "up";
            return (
              <Reveal key={img.id} variant={variant} delay={(i % 3) * 80}>
                <button
                  onClick={() => setActive(i)}
                  className={`group relative block w-full overflow-hidden rounded-2xl ${
                    i % 5 === 0 ? "aspect-square md:row-span-2 md:aspect-auto md:h-full" : "aspect-square"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.caption ?? ""}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  {img.caption && (
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-sm text-white opacity-0 transition group-hover:opacity-100">
                      {img.caption}
                    </span>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {active !== null && content.gallery[active] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <img
            src={content.gallery[active].src}
            alt={content.gallery[active].caption ?? ""}
            className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
