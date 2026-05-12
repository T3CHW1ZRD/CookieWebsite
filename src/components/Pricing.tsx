import Reveal from "./Reveal";
import { useContent } from "../lib/store";

export default function Pricing() {
  const { content } = useContent();
  if (!content.pricing || content.pricing.length === 0) return null;

  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/40">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <Reveal>
            <p className="font-script text-2xl text-primary mb-2">prices</p>
            <h2 className="text-4xl md:text-5xl">Pick your box.</h2>
            <p className="mt-4 text-muted-foreground">
              Mix and match any flavours in any size. Made fresh to order.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {content.pricing.map((tier, idx) => {
            const featured = idx === 1;
            return (
              <Reveal key={tier.id} delay={idx * 80}>
                <div
                  className={`relative h-full rounded-2xl border p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                    featured
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                      Most popular
                    </span>
                  )}
                  <p
                    className={`font-script text-2xl mb-2 ${
                      featured ? "text-primary-foreground/90" : "text-primary"
                    }`}
                  >
                    {tier.label.toLowerCase()}
                  </p>
                  <p className="font-display text-5xl md:text-6xl mb-2">{tier.price}</p>
                  <p
                    className={`text-sm ${
                      featured ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {tier.size}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {content.shop.fulfillment}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
