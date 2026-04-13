import { FaGithub, FaEnvelope } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Lantean's Blog</h3>
            <p className="text-sm text-muted-foreground">
              分享技术文章、研究成果、日常生活记录
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <a href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  博客
                </a>
              </li>
              <li>
                <a href="/academic" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  学术
                </a>
              </li>
              <li>
                <a href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  项目
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  关于
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">联系方式</h4>
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
            © {currentYear} Lantean's Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
