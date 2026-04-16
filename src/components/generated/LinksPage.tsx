import { FaExternalLinkAlt } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export function LinksPage() {
  const { language } = useLanguage();
  const links = [
    {
      id: 1,
      name: "阮一峰的网络日志",
      url: "https://www.ruanyifeng.com/blog/",
      description: "知名技术博主，分享前端技术、互联网趋势等内容",
    },
    {
      id: 2,
      name: "酷壳 - CoolShell",
      url: "https://coolshell.cn/",
      description: "左耳朵耗子的技术博客，涵盖编程、架构、职场等话题",
    },
    {
      id: 3,
      name: "美团技术团队",
      url: "https://tech.meituan.com/",
      description: "美团官方技术博客，分享大规模系统架构和实践经验",
    },
    {
      id: 4,
      name: "Google AI Blog",
      url: "https://ai.googleblog.com/",
      description: "Google 官方 AI 博客，追踪最新人工智能研究进展",
    },
    {
      id: 5,
      name: "GitHub Blog",
      url: "https://github.blog/",
      description: "GitHub 官方博客，了解开发者社区动态",
    },
    {
      id: 6,
      name: "Stack Overflow Blog",
      url: "https://stackoverflow.blog/",
      description: "全球最大开发者社区的博客，技术趋势和洞察",
    },
  ];

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  const getFaviconUrl = (url: string) => {
    const hostname = getHostname(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "zh" ? "友情链接" : "Friend Links"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "zh"
              ? "这里展示了一些我推荐的优质博客和相关网站"
              : "A curated list of blogs and websites I recommend"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 rounded-lg hover:border-foreground/20 hover:bg-card/70 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <img
                  src={getFaviconUrl(link.url)}
                  alt={link.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.fallbackApplied) {
                      img.dataset.fallbackApplied = "true";
                      img.src = "https://www.google.com/favicon.ico";
                    }
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                    {link.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {link.description}
                  </p>
                  <div className="flex items-center text-sm text-primary">
                    <span>{language === "zh" ? "访问网站" : "Visit Site"}</span>
                    <FaExternalLinkAlt className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
