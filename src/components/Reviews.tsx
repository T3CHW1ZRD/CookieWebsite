import { Star } from "lucide-react";
import Reveal from "./Reveal";
import { useContent } from "../lib/store";

export default function Reviews() {
  const { content } = useContent();

  return (
    <section id="reviews" className="py-20 md:py-28">
      <div className="container-page">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <Reveal>
            <p className="font-script text-2xl text-primary mb-2">happy mouths</p>
            <h2 className="text-4xl md:text-5xl">What people say.</h2>
          </Reveal>
          <Reveal variant="right">
            <div className="flex items-center gap-2 text-muted-foreground">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-primary text-primary" size={18} />
              ))}
              <span className="text-sm">Rated 5.0 from {content.reviews.length}+ reviews</span>
            </div>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.reviews.map((r, idx) => (
            <Reveal key={r.id} delay={idx * 70}>
              <figure className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="fill-primary text-primary" size={16} />
                  ))}
                </div>
                <blockquote className="text-foreground/90 leading-relaxed">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold">{r.author}</span>
                  {r.date && <span className="text-muted-foreground">{r.date}</span>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
