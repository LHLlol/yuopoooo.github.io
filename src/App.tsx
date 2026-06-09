import { useEffect, useMemo, useState } from "react";
import CursorGlow from "./components/CursorGlow";
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

  return (
    <>
      <CursorGlow />
      {page}
    </>
  );
}
