import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { PageMeta } from "./components/common/PageMeta";

function App() {
  const [isDark, setIsDark] = useState(false);

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
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <PageMeta
            title="Lantean's Blog"
            description="分享技术文章、研究成果、日常生活记录"
            keywords={["blog", "technology", "AI", "research", "Lantean"]}
          />
          <Header isDark={isDark} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/academic" element={<AcademicPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
