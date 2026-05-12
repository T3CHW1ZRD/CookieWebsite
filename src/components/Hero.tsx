import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { useContent } from "../lib/store";

export default function Hero() {
  const { content } = useContent();
  const heroImage = content.gallery[0]?.src ?? content.menu[0]?.image;
  const logoSrc = `${import.meta.env.BASE_URL}logo/lailahs-logo.png`;

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Soft pink gradient blobs. transform-gpu + will-change lock these to
          their own GPU layer so mobile pinch-zoom doesn't repaint them and
          cause the pink to flicker. */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent/70 blur-3xl transform-gpu"
        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
      />
      <div
        className="pointer-events-none absolute top-40 -right-32 h-96 w-96 rounded-full bg-secondary blur-3xl transform-gpu"
        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
      />

      <div className="container-page relative grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <img src={logoSrc} alt="" className="h-14 w-14 object-contain md:hidden" />
            <p className="font-script text-3xl md:text-4xl text-primary/90">
              {content.shop.tagline}
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-foreground"
          >
            {content.shop.heroHeadline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            {content.shop.heroSubcopy}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href={content.shop.orderUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <Instagram size={18} /> Order on Instagram
            </a>
            <a href="#menu" className="btn-ghost">
              See the flavours
            </a>
          </motion.div>
        </div>

        {heroImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto md:mx-0 md:justify-self-end"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/15 blur-2xl" aria-hidden />
            <img
              src={heroImage}
              alt=""
              className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-[2rem] object-cover shadow-xl ring-1 ring-black/5"
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl bg-background/95 backdrop-blur px-4 py-3 shadow-lg ring-1 ring-border"
            >
              <img src={logoSrc} alt="" className="h-10 w-10 object-contain" />
              <div>
                <p className="font-script text-lg text-primary leading-none">made to order</p>
                <p className="text-xs text-muted-foreground">{content.shop.noticeWindow}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
