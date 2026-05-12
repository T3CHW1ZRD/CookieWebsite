import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import AdminGate from "./AdminGate";
import InfoEditor from "./InfoEditor";
import MenuEditor from "./MenuEditor";
import GalleryEditor from "./GalleryEditor";
import ReviewsEditor from "./ReviewsEditor";
import PublishPanel from "./PublishPanel";
import { useContent } from "../lib/store";

type Tab = "info" | "menu" | "gallery" | "reviews" | "publish";

const TABS: { id: Tab; label: string }[] = [
  { id: "info", label: "Shop info" },
  { id: "menu", label: "Menu" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
  { id: "publish", label: "Publish" },
];

export default function Dashboard() {
  return (
    <AdminGate>
      <DashboardInner />
    </AdminGate>
  );
}

function DashboardInner() {
  const [tab, setTab] = useState<Tab>("info");
  const { resetToSeed } = useContent();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} /> View site
            </Link>
            <span className="text-xl font-display text-primary">Dashboard</span>
          </div>
          <button
            onClick={() => {
              if (confirm("Reset all content to the placeholder demo? This wipes local edits.")) {
                resetToSeed();
              }
            }}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <RotateCcw size={14} /> Reset demo
          </button>
        </div>
      </header>

      <div className="container-page py-8">
        <nav className="mb-8 flex flex-wrap gap-2 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "info" && <InfoEditor />}
        {tab === "menu" && <MenuEditor />}
        {tab === "gallery" && <GalleryEditor />}
        {tab === "reviews" && <ReviewsEditor />}
        {tab === "publish" && <PublishPanel />}
      </div>
    </div>
  );
}
