import { FaGithub, FaEnvelope } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              {language === "zh" ? "Lantean 的博客" : "Lantean's Blog"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "zh"
                ? "分享技术文章、研究成果、日常生活记录"
                : "Sharing technical articles, research updates, and daily notes"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              {language === "zh" ? "快速链接" : "Quick Links"}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === "zh" ? "博客" : "Blog"}
                </a>
              </li>
              <li>
                <a href="/academic" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === "zh" ? "学术" : "Academic"}
                </a>
              </li>
              <li>
                <a href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === "zh" ? "项目" : "Projects"}
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {language === "zh" ? "关于" : "About"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              {language === "zh" ? "联系方式" : "Contact"}
            </h4>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/lantean"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@lantean.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {language === "zh"
              ? `© ${currentYear} Lantean 的博客。保留所有权利。`
              : `© ${currentYear} Lantean's Blog. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
