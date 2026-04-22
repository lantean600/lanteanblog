import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "./components/generated/Header";
import { Footer } from "./components/generated/Footer";
import { HomePage } from "./components/generated/HomePage";
import { BlogList } from "./components/generated/BlogList";
import { BlogDetail } from "./components/generated/BlogDetail";
import { AcademicPage } from "./components/generated/AcademicPage";
import { ProjectsPage } from "./components/generated/ProjectsPage";
import { LinksPage } from "./components/generated/LinksPage";
import { AboutPage } from "./components/generated/AboutPage";
import { TagPostsPage } from "./components/generated/TagPostsPage";
import { SearchPostsPage } from "./components/generated/SearchPostsPage";
import { CollectionsPage } from "./components/generated/CollectionsPage";
import { PageMeta } from "./components/common/PageMeta";
import { LanguageProvider } from "./context/LanguageContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncScrollDepth = () => {
      document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };

    syncScrollDepth();
    window.addEventListener("scroll", syncScrollDepth, { passive: true });
    return () => window.removeEventListener("scroll", syncScrollDepth);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <HelmetProvider>
      <LanguageProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <div className="relative min-h-screen overflow-x-clip bg-background">
              <div aria-hidden className="atmo-layer atmo-layer-a" />
              <div aria-hidden className="atmo-layer atmo-layer-b" />
              <div aria-hidden className="atmo-layer atmo-layer-c" />
              <div aria-hidden className="grain-overlay" />
              <PageMeta
                title="Lantean's Blog"
                description="Sharing technical articles, research updates, and daily notes"
                keywords={["blog", "technology", "AI", "research", "Lantean"]}
                url="https://lanteanblog.pages.dev"
                image="https://lanteanblog.pages.dev/images/share-card.png"
                siteName="Lantean's Blog"
                twitterCard="summary_large_image"
              />
              <Header isDark={isDark} toggleTheme={toggleTheme} />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/search" element={<SearchPostsPage />} />
                <Route path="/blog/tag/:tag" element={<TagPostsPage />} />
                <Route path="/blog/collections" element={<CollectionsPage />} />
                <Route path="/blog/collections/:collectionId" element={<CollectionsPage />} />
                <Route path="/blog/:category/:slug" element={<BlogDetail />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/academic" element={<AcademicPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/links" element={<LinksPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </ErrorBoundary>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
