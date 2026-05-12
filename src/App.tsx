import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Menu from "./components/Menu";
import Pricing from "./components/Pricing";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { ContentProvider, useContent } from "./lib/store";

const ADMIN_ENABLED = import.meta.env.VITE_ENABLE_ADMIN === "true";

// Lazy-load Dashboard so it only ships in builds where admin is enabled.
const Dashboard = ADMIN_ENABLED
  ? lazy(() => import("./admin/Dashboard"))
  : null;

function Site() {
  const { content } = useContent();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Menu />
        <Pricing />
        <Gallery />
        {content.reviews.length > 0 && <Reviews />}
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <Routes>
        <Route path="/" element={<Site />} />
        {ADMIN_ENABLED && Dashboard && (
          <Route
            path="/CookieAdmin"
            element={
              <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
                <Dashboard />
              </Suspense>
            }
          />
        )}
        {/* Catch-all so visiting /#about, /#menu, etc. still renders the site
            and the browser can scroll to the matching section id. */}
        <Route path="*" element={<Site />} />
      </Routes>
    </ContentProvider>
  );
}
