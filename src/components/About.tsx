import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { useContent } from "../lib/store";

export default function About() {
  const { content } = useContent();
  if (!content.shop.aboutBody) return null;

  const logoSrc = `${import.meta.env.BASE_URL}logo/lailahs-logo.png`;

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container-page grid md:grid-cols-[1fr_1.4fr] gap-12 items-center">
        <Reveal variant="left">
          <motion.div
            whileInView={{ rotate: [0, -2, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            viewport={{ once: false }}
            className="relative mx-auto md:mx-0 max-w-xs"
          >
            <div className="absolute inset-0 -m-6 rounded-full bg-primary/15 blur-2xl" aria-hidden />
            <img
              src={logoSrc}
              alt={content.shop.brandName}
              className="relative w-full h-auto object-contain drop-shadow-lg"
            />
          </motion.div>
        </Reveal>

        <Reveal variant="right">
          <p className="font-script text-2xl text-primary mb-2">our story</p>
          <h2 className="text-4xl md:text-5xl mb-6">
            Hi, I&rsquo;m Lailah.
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/85 whitespace-pre-line">
            {content.shop.aboutBody}
          </p>
          <p className="font-script text-2xl text-primary mt-6">
            — thank you for being here 💗
          </p>
        </Reveal>
      </div>
    </section>
  );
}
