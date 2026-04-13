import { Link } from "react-router-dom";
import { FaGithub, FaEnvelope } from "react-icons/fa";

export function HomePage() {
  const stats = {
    daysOnline: 667,
    lastUpdated: "Apr 13, 2026",
    totalWords: "33.1w",
    totalPosts: 42,
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src="https://baas-api.wanwang.xin/toc/image/preview/professional-avatar.jpg?w=200&h=200&q=85"
              alt="Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-border shadow-lg"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Lantean
              </h1>
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <a
                  href="https://github.com/lantean"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 rounded-lg hover:from-primary/10 hover:via-primary/5 hover:to-primary/10 transition-all duration-300 border border-border hover:border-primary/40"
                >
                  <FaGithub className="w-5 h-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a
                  href="mailto:contact@lantean.com"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 rounded-lg hover:from-primary/10 hover:via-primary/5 hover:to-primary/10 transition-all duration-300 border border-border hover:border-primary/40"
                >
                  <FaEnvelope className="w-5 h-5" />
                  <span className="text-sm font-medium">Email</span>
                </a>
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 rounded-lg border border-border">
                  <span className="text-sm font-medium">China</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                你好！我是一名热爱技术的开发者，专注于人工智能和全栈开发。在这里分享我的技术文章、研究成果和日常生活。
              </p>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16">
          <div className="flex items-start gap-6">
            <div className="hidden md:block w-32 flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground sticky top-24">
                教育经历
              </h2>
            </div>
            <div className="flex-1 space-y-4">
              <div className="md:hidden mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  教育经历
                </h2>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200">
                <h3 className="font-semibold text-foreground mb-1">上海人工智能实验室</h3>
                <p className="text-sm text-muted-foreground mb-2">具身智能中心，实习生</p>
                <p className="text-xs text-muted-foreground font-mono">2024 年 7 月 - 至今</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200">
                <h3 className="font-semibold text-foreground mb-1">西安交通大学</h3>
                <p className="text-sm text-muted-foreground mb-2">人工智能专业，本科</p>
                <p className="text-xs text-muted-foreground font-mono">2022 年 9 月 - 至今</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-16">
          <div className="flex items-start gap-6">
            <div className="hidden md:block w-32 flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground sticky top-24">
                数据统计
              </h2>
            </div>
            <div className="flex-1">
              <div className="md:hidden mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  数据统计
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.daysOnline}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    天在线
                  </div>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.lastUpdated}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    最后更新
                  </div>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.totalWords}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    总字数
                  </div>
                </div>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    文章总数
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {stats.totalPosts}
                  </span>
                </div>
              </div>

              {/* Contribution Heatmap Placeholder */}
              <div className="p-6 bg-card border border-border rounded-lg">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Less</span>
                  <span className="text-sm text-muted-foreground">More</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 84 }).map((_, i) => {
                    const intensity = Math.random();
                    let bgColor = "bg-muted";
                    if (intensity > 0.8) bgColor = "bg-green-600";
                    else if (intensity > 0.6) bgColor = "bg-green-500";
                    else if (intensity > 0.4) bgColor = "bg-green-400";
                    else if (intensity > 0.2) bgColor = "bg-green-300";
                    else if (intensity > 0.1) bgColor = "bg-green-200";
                    return (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${bgColor} hover:scale-125 transition-transform cursor-pointer`}
                        title={`Contribution ${Math.floor(intensity * 10)}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Link
            to="/about"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <span>了解更多</span>
            <span>→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
