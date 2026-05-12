import Reveal from "./Reveal";
import { useContent } from "../lib/store";

export default function Menu() {
  const { content } = useContent();

  return (
    <section id="menu" className="py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center mb-14 md:mb-16">
          <Reveal>
            <p className="font-script text-2xl text-primary mb-2">current flavours</p>
            <h2 className="text-4xl md:text-5xl">The line-up.</h2>
            <p className="mt-4 text-muted-foreground">
              Made fresh to order. Mix and match any flavours in any box —
              the photos below show what they look like together.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-x-12 gap-y-10">
          {content.menu.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 50}>
              <article className="group relative">
                <div className="flex items-baseline gap-3">
                  <span className="font-script text-primary/60 text-2xl select-none">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl leading-tight">
                    {item.name}
                  </h3>
                </div>
                <p className="mt-3 ml-9 text-foreground/75 leading-relaxed">
                  {item.description}
                </p>
                <span className="mt-5 ml-9 block h-px w-12 bg-primary/40 transition-all duration-500 group-hover:w-24" />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-14 text-center font-script text-2xl text-primary/80">
            scroll down to see them in real life ↓
          </p>
        </Reveal>
      </div>
    </section>
  );
}
