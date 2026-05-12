import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import AdminGate, { SESSION_KEY } from "./AdminGate";
import InfoEditor from "./InfoEditor";
import MenuEditor from "./MenuEditor";
import PricingEditor from "./PricingEditor";
import GalleryEditor from "./GalleryEditor";
import PublishPanel from "./PublishPanel";

type Tab = "info" | "menu" | "pricing" | "gallery" | "publish";

const TABS: { id: Tab; label: string }[] = [
  { id: "info", label: "Shop info" },
  { id: "menu", label: "Flavours" },
  { id: "pricing", label: "Pricing" },
  { id: "gallery", label: "Gallery" },
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

  function logout() {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }

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
            onClick={logout}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <LogOut size={14} /> Log out
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
        {tab === "pricing" && <PricingEditor />}
        {tab === "gallery" && <GalleryEditor />}
        {tab === "publish" && <PublishPanel />}
      </div>
    </div>
  );
}
