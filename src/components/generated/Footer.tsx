import { FaEnvelope, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  return (
    <footer className="mt-16 border-t border-border/70 bg-card/50 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 px-4 text-center sm:px-6 lg:px-8">
        <p className="poetic-title animate-shimmerDrift">Closing Notes</p>
        <p className="max-w-xl text-sm text-muted-foreground">
          {language === "zh"
            ? "分享技术文章、研究进展与日常记录"
            : "Sharing technical articles, research updates, and daily notes"}
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-5 text-[0.77rem] uppercase tracking-[0.15em] text-muted-foreground">
          <Link to="/blog" className="transition-colors hover:text-primary">
            {language === "zh" ? "博客" : "Blog"}
          </Link>
          <Link to="/academic" className="transition-colors hover:text-primary">
            {language === "zh" ? "学术" : "Academic"}
          </Link>
          <Link to="/projects" className="transition-colors hover:text-primary">
            {language === "zh" ? "项目" : "Projects"}
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            {language === "zh" ? "关于" : "About"}
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-5">
          <a
            href="https://github.com/lantean"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border/70 p-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            aria-label="GitHub"
          >
            <FaGithub className="h-5 w-5" />
          </a>
          <a
            href="mailto:contact@lantean.com"
            className="rounded-full border border-border/70 p-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            aria-label="Email"
          >
            <FaEnvelope className="h-5 w-5" />
          </a>
        </div>

        <p className="text-xs tracking-wide text-muted-foreground">
          © {currentYear} Lantean's Blog
        </p>
      </div>
    </footer>
  );
}
