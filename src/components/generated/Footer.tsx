import { FaEnvelope, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/35 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          {language === "zh"
            ? "分享技术文章、研究进展与日常记录"
            : "Sharing technical articles, research updates, and daily notes"}
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/blog" className="hover:text-primary transition-colors">
            {language === "zh" ? "博客" : "Blog"}
          </Link>
          <Link to="/academic" className="hover:text-primary transition-colors">
            {language === "zh" ? "学术" : "Academic"}
          </Link>
          <Link to="/projects" className="hover:text-primary transition-colors">
            {language === "zh" ? "项目" : "Projects"}
          </Link>
          <Link to="/about" className="hover:text-primary transition-colors">
            {language === "zh" ? "关于" : "About"}
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/lantean"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="h-5 w-5" />
          </a>
          <a
            href="mailto:contact@lantean.com"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Email"
          >
            <FaEnvelope className="h-5 w-5" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          © {currentYear} Lantean's Blog
        </p>
      </div>
    </footer>
  );
}
