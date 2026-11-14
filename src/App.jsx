import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Header, Footer } from "./components/UI";
import Home from "./pages/Home";
import {
  History,
  Concept,
  Spaces,
  SpaceDetail,
  Visit,
  Residents,
  About,
  ImageCredits,
  Shop,
  NotFound,
} from "./pages/Pages";
import { Events, EventDetail } from "./pages/Events";
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const h = document.querySelector("h1");
    document.title = `${h?.innerText?.replace(/\s+/g, " ") || "Михайловское"} — кинорезиденция`;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/concept" element={<Concept />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/spaces/:slug" element={<SpaceDetail />} />
          <Route
            path="/opening-2030"
            element={<Navigate to="/events?program=opening" replace />}
          />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/image-credits" element={<ImageCredits />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <RouteEffects />
    </>
  );
}
