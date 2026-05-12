import { Instagram } from "lucide-react";
import { useContent } from "../lib/store";

export default function Footer() {
  const { content } = useContent();
  const logoSrc = `${import.meta.env.BASE_URL}logo/lailahs-logo.png`;
  const { socials } = content.shop;

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logoSrc} alt="" className="h-10 w-10 object-contain" />
          <div>
            <p className="font-script text-2xl text-primary leading-none">
              {content.shop.brandName}
            </p>
            <p className="text-xs text-muted-foreground mt-1">since 2025 · made with love</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {socials.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-border p-2.5 transition hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <Instagram size={18} />
            </a>
          )}
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {content.shop.brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}
