import { useEffect, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { useContent } from "../lib/store";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#menu", label: "Flavours" },
  { href: "#pricing", label: "Pricing" },
  { href: "#gallery", label: "Gallery" },
  { href: "#order", label: "Order" },
];

export default function Nav() {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoSrc = `${import.meta.env.BASE_URL}logo/lailahs-logo.png`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-background/85 border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src={logoSrc}
            alt={content.shop.brandName}
            className="h-10 w-10 object-contain shrink-0"
          />
          <span className="font-script text-xl sm:text-2xl text-primary leading-none whitespace-nowrap">
            {content.shop.brandName}
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-foreground/80 transition hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={content.shop.orderUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-sm py-2 px-4"
          >
            Order on Instagram
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <ul className="container-page py-4 flex flex-col gap-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-border">
              <a
                href={content.shop.orderUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-sm py-2 px-4 w-full"
              >
                Order on Instagram
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
