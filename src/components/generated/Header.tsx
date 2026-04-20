import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaMoon, FaSearch, FaSun, FaTimes } from "react-icons/fa";
import { useLanguage, type Language } from "@/context/LanguageContext";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const languages: { code: Language; name: string }[] = [
    { code: "zh", name: "中文" },
    { code: "en", name: "English" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 p-2 text-foreground transition-colors hover:text-primary"
        aria-label={language === "zh" ? "切换语言" : "Switch language"}
      >
        <span>{languages.find((lang) => lang.code === language)?.name}</span>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-44 rounded-lg border border-border/50 bg-card/90 py-2 shadow-lg backdrop-blur-md">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                language === lang.code
                  ? "font-medium text-primary"
                  : "text-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: language === "zh" ? "博客" : "Blog", path: "/blog", hasDropdown: true },
    { name: language === "zh" ? "学术" : "Academic", path: "/academic" },
    { name: language === "zh" ? "项目" : "Projects", path: "/projects" },
    { name: language === "zh" ? "友链" : "Links", path: "/links" },
    { name: language === "zh" ? "关于" : "About", path: "/about" },
  ];

  const blogCategories = [
    { name: language === "zh" ? "研究" : "Research", path: "/blog?category=research" },
    { name: language === "zh" ? "技术" : "Technical", path: "/blog?category=technical" },
    { name: language === "zh" ? "日常" : "Daily", path: "/blog?category=daily" },
    { name: language === "zh" ? "月刊" : "Journal", path: "/blog?category=journal" },
  ];

  const isActive = (path: string) => {
    if (path === "/blog") {
      return location.pathname === "/blog" || location.pathname.startsWith("/blog/");
    }
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-strong border-b border-border/60 shadow-[0_8px_28px_hsla(210,20%,10%,0.1)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group inline-flex flex-col leading-none text-foreground transition-colors hover:text-primary">
          <span className="font-heading text-2xl tracking-wide">Lantean</span>
          <span className="poetic-title mt-1 transition-colors group-hover:text-primary/80">NOTES & RESEARCH</span>
        </Link>

        <nav className="hidden items-center space-x-7 md:flex">
          {navItems.map((item) => (
            <div
              key={item.path}
              className="relative"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.path)}
              onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
              onFocus={() => item.hasDropdown && setActiveDropdown(item.path)}
              onBlur={(e) => {
                if (item.hasDropdown && !e.currentTarget.contains(e.relatedTarget)) {
                  setActiveDropdown(null);
                }
              }}
            >
              <Link
                to={item.path}
                className={`rounded-sm px-1 text-[0.86rem] uppercase tracking-[0.13em] transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  isActive(item.path) ? "text-primary" : "text-foreground/88"
                }`}
              >
                {item.name}
              </Link>
              {item.hasDropdown && (
                <div
                  className={`absolute left-0 top-full mt-2 w-52 rounded-xl border border-border/60 bg-card/85 py-2 shadow-[0_14px_34px_hsla(210,28%,12%,0.17)] backdrop-blur-xl transition-all duration-200 ${
                    activeDropdown === item.path ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  {blogCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="block px-4 py-2 text-sm text-foreground/90 transition-colors hover:bg-muted/70 hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Link
            to="/search"
            className="hidden rounded-full border border-transparent p-2 text-foreground transition-colors hover:border-border/70 hover:text-primary md:inline-flex"
            aria-label={language === "zh" ? "搜索" : "Search"}
          >
            <FaSearch className="h-4 w-4" />
          </Link>

          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="rounded-full border border-transparent p-2 text-foreground transition-colors hover:border-border/70 hover:text-primary"
            aria-label="Toggle theme"
          >
            {isDark ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="rounded-full border border-transparent p-2 text-foreground transition-colors hover:border-border/70 hover:text-primary md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-b border-border/60 bg-card/85 backdrop-blur-xl md:hidden">
          <div className="space-y-4 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-[0.92rem] tracking-[0.06em] transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-foreground/90"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {language === "zh" ? "搜索" : "Search"}
            </Link>

            <div className="flex items-center space-x-4 border-t border-border pt-4">
              <LanguageSwitcher />
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 text-sm text-foreground transition-colors hover:text-primary"
              >
                {isDark ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
                <span>{isDark ? (language === "zh" ? "浅色模式" : "Light Mode") : (language === "zh" ? "深色模式" : "Dark Mode")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
