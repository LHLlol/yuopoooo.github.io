import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CursorGlow from "./components/CursorGlow";
import OpeningTransition from "./components/OpeningTransition";
import PortfolioAI from "./components/PortfolioAI";
import PortfolioFooter from "./components/PortfolioFooter";
import { getCategoryById, getPortfolioItemById, type PortfolioCategoryId } from "./data/portfolioData";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

type Route =
  | { name: "home" }
  | { name: "category"; categoryId: PortfolioCategoryId }
  | { name: "work"; id: string };

const parseRoute = (): Route => {
  const cleanHash = window.location.hash.replace(/^#\/?/, "");
  const [section, value] = cleanHash.split("/");

  if (section === "category" && value) {
    return { name: "category", categoryId: value as PortfolioCategoryId };
  }

  if (section === "work" && value) {
    return { name: "work", id: value };
  }

  return { name: "home" };
};

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const page = useMemo(() => {
    if (route.name === "category") {
      const category = getCategoryById(route.categoryId);
      return category ? <CategoryPage categoryId={route.categoryId} /> : <HomePage />;
    }

    if (route.name === "work") {
      const item = getPortfolioItemById(route.id);
      return item ? <ProjectDetailPage item={item} /> : <HomePage />;
    }

    return <HomePage />;
  }, [route]);

  const routeKey = route.name === "home" ? "home" : route.name === "category" ? `category-${route.categoryId}` : `work-${route.id}`;

  return (
    <>
      {/* UI REVIEW FIX [WCAG 2.4.1]: bypass repeated navigation and decorative motion. */}
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <OpeningTransition />
      <CursorGlow />
      <PortfolioAI />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={routeKey}
          className="page-transition-shell"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          {page}
        </motion.div>
      </AnimatePresence>
      <PortfolioFooter />
    </>
  );
}
