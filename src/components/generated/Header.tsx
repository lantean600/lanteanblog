import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { useLanguage, type Language } from "@/context/LanguageContext";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
      return location.pathname === "/blog" || location.pathname === "/";
    }
    return location.pathname === path;
  };

  // 语言切换器实现
  const LanguageSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const languages: { code: Language; name: string }[] = [
      { code: "zh", name: "中文" },
      { code: "en", name: "English" },
    ];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLanguageChange = (code: "zh" | "en") => {
      setLanguage(code);
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="p-2 text-foreground hover:text-primary transition-colors flex items-center gap-2"
          aria-label={language === "zh" ? "切换语言" : "Switch language"}
        >
          <span>{languages.find((lang) => lang.code === language)?.name}</span>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  language === lang.code
                    ? "text-primary font-medium"
                    : "text-foreground hover:bg-muted hover:text-primary"
                } transition-colors`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Lantean's Blog
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.path)}
                onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
                {item.hasDropdown && (
                  <div
                    className={`absolute top-full left-0 w-48 bg-card border border-border rounded-lg shadow-lg py-2 transition-all duration-200 ${
                      activeDropdown === item.path ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                  >
                    {blogCategories.map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            <button
              onClick={toggleTheme}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                {isDark ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
                <span>{isDark ? (language === "zh" ? "浅色模式" : "Light Mode") : (language === "zh" ? "深色模式" : "Dark Mode")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

