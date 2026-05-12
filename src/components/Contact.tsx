import { Clock, Truck, Wheat, Instagram } from "lucide-react";
import Reveal from "./Reveal";
import { useContent } from "../lib/store";

export default function Contact() {
  const { content } = useContent();
  const { socials } = content.shop;
  const igHandle = socials.instagram
    ? "@" + socials.instagram.replace(/\/$/, "").split("/").pop()
    : "";

  return (
    <section id="order" className="py-20 md:py-28 bg-muted/40">
      <div className="container-page grid md:grid-cols-2 gap-12 items-start">
        <Reveal variant="left">
          <p className="font-script text-2xl text-primary mb-2">how to order</p>
          <h2 className="text-4xl md:text-5xl mb-6">DM to order.</h2>
          <p className="text-foreground/85 max-w-md mb-8">
            Send a message on Instagram with your order, preferred pickup or delivery date,
            and any allergen questions. I&rsquo;ll confirm and lock you in.
          </p>

          <ul className="space-y-5 text-foreground/90">
            <li className="flex gap-3">
              <Clock className="mt-1 text-primary shrink-0" size={20} />
              <div>
                <p className="font-semibold">Notice window</p>
                <p className="text-sm text-muted-foreground">{content.shop.noticeWindow}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Truck className="mt-1 text-primary shrink-0" size={20} />
              <div>
                <p className="font-semibold">Pickup & delivery</p>
                <p className="text-sm text-muted-foreground">{content.shop.fulfillment}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Wheat className="mt-1 text-primary shrink-0" size={20} />
              <div>
                <p className="font-semibold">Ingredients & allergens</p>
                <p className="text-sm text-muted-foreground">{content.shop.allergens}</p>
                <p className="text-xs text-muted-foreground mt-1">Please review before ordering.</p>
              </div>
            </li>
          </ul>
        </Reveal>

        <Reveal variant="right">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5">
              <Instagram size={32} />
            </div>
            <h3 className="font-display text-3xl mb-2">{igHandle || "Instagram"}</h3>
            <p className="text-muted-foreground mb-6">
              All orders, updates, and new flavours go up on Instagram first.
            </p>
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full justify-center"
              >
                <Instagram size={18} /> Order on Instagram
              </a>
            )}
            <p className="font-script text-2xl text-primary mt-8">
              made fresh, just for you 💗
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
