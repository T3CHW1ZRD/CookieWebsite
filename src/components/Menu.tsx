import Reveal from "./Reveal";
import { useContent } from "../lib/store";

export default function Menu() {
  const { content } = useContent();

  return (
    <section id="menu" className="py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl mb-12">
          <Reveal>
            <p className="font-script text-2xl text-primary mb-2">current flavours</p>
            <h2 className="text-4xl md:text-5xl">The line-up.</h2>
            <p className="mt-4 text-muted-foreground">
              Made fresh to order. Mix and match in any box.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.menu.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 60}>
              <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary via-muted to-accent/60 p-6 text-center">
                      <span className="font-script text-3xl md:text-4xl text-primary/80 leading-tight">
                        {item.name}
                      </span>
                    </div>
                  )}
                  {item.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                      {item.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl">{item.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
