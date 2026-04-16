import { Link } from "react-router-dom";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import avatarFallback from "@/assets/avatar-fallback.svg";
import { useLanguage } from "@/context/LanguageContext";
import { useBlogStatistics } from "@/hooks/use-blog-statistics";

const getHeatmapColor = (level: number, isDark: boolean = false) => {
  const colors = isDark
    ? [
        "bg-gray-800", // level 0
        "bg-green-900", // level 1
        "bg-green-700", // level 2
        "bg-green-500", // level 3
        "bg-green-300", // level 4
      ]
    : [
        "bg-gray-200", // level 0
        "bg-green-200", // level 1
        "bg-green-400", // level 2
        "bg-green-600", // level 3
        "bg-green-800", // level 4
      ];
  return colors[level] || colors[0];
};

const getMonthLabels = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const labels: string[] = [];
  
  // 生成过去12个月的标签
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(months[date.getMonth()]);
  }
  
  return labels;
};

export function HomePage() {
  const { language } = useLanguage();
  const { stats, loading } = useBlogStatistics(language);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">
          {language === "zh" ? "加载中..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={avatarFallback}
              alt="Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-border shadow-lg"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Lantean
              </h1>
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <a
                  href="https://github.com/lantean600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 rounded-lg hover:from-primary/10 hover:via-primary/5 hover:to-primary/10 transition-all duration-300 border border-border hover:border-primary/40"
                >
                  <FaGithub className="w-5 h-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a
                  href="mailto:614635562@qq.com"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 rounded-lg hover:from-primary/10 hover:via-primary/5 hover:to-primary/10 transition-all duration-300 border border-border hover:border-primary/40"
                >
                  <FaEnvelope className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {language === "zh" ? "邮箱" : "614635562@qq.com"}
                  </span>
                </a>
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 rounded-lg border border-border">
                  <span className="text-sm font-medium">
                    {language === "zh" ? "中国" : "China"}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {language === "zh"
                  ? "你好！我是一名热爱技术的开发者，专注于人工智能和全栈开发。在这里分享我的技术文章、研究成果和日常生活。"
                  : "Hi! I'm a tech enthusiast focused on AI and full-stack development. I share technical articles, research progress, and daily notes here."}
              </p>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16">
          <div className="flex items-start gap-6">
            <div className="hidden md:block w-32 flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground sticky top-24">
                {language === "zh" ? "教育经历" : "Education"}
              </h2>
            </div>
            <div className="flex-1 space-y-4">
              <div className="md:hidden mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {language === "zh" ? "教育经历" : "Education"}
                </h2>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200">
                <h3 className="font-semibold text-foreground mb-1">太原理工大学</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {language === "zh" ? "软件工程专业，本科" : "B.S. in Taiyuan University of Technology"}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {language === "zh" ? "2025 年 9 月 - 至今" : "Sep 2025 - Present"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-16">
          <div className="flex items-start gap-6">
            <div className="hidden md:block w-32 flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground sticky top-24">
                {language === "zh" ? "数据统计" : "Statistics"}
              </h2>
            </div>
            <div className="flex-1">
              <div className="md:hidden mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {language === "zh" ? "数据统计" : "Statistics"}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-6 rounded-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.daysOnline}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === "zh" ? "天在线" : "Days Online"}
                  </div>
                </div>
                <div className="glass-card p-6 rounded-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {stats.lastUpdated}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === "zh" ? "最后更新" : "Last Updated"}
                  </div>
                </div>
                <div className="glass-card p-6 rounded-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.totalWords >= 10000
                      ? `${(stats.totalWords / 10000).toFixed(1)}w`
                      : stats.totalWords.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === "zh" ? "总字数" : "Total Words"}
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === "zh" ? "文章总数" : "Total Posts"}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {stats.totalPosts}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contribution Heatmap Section */}
        <section className="mb-16">
          <div className="glass-card p-6 rounded-lg overflow-x-auto">
            <div className="min-w-[650px]">
              {/* Month labels */}
              <div className="flex mb-2 pl-[52px]">
                <div className="flex-1 flex justify-between">
                  {getMonthLabels().map((month, i) => (
                    <div
                      key={i}
                      className="text-xs text-muted-foreground"
                      style={{ flex: 1 }}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-2">
                {/* Day labels */}
                <div className="flex flex-col gap-[3px] justify-between text-xs text-muted-foreground py-[2px]">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={i} className="h-[11px] leading-[11px] text-right pr-2">
                      {i % 2 === 1 ? day : ''}
                    </div>
                  ))}
                </div>

                {/* Heatmap cells - 52 weeks x 7 days */}
                <div className="flex-1">
                  <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
                    {Array.from({ length: 52 }).map((_, weekIndex) => (
                      <div key={weekIndex} className="contents">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          const cellIndex = weekIndex * 7 + dayIndex;
                          const cell = stats.heatmap[cellIndex];
                          const level = cell?.level ?? 0;
                          const count = cell?.count ?? 0;
                          const date = cell?.date ?? '';
                          
                          return (
                            <div
                              key={`${weekIndex}-${dayIndex}`}
                              className={`w-[11px] h-[11px] rounded-sm ${getHeatmapColor(level)} hover:opacity-80 transition-opacity cursor-pointer`}
                              title={`${date}: ${count} ${language === "zh" ? "篇文章" : "post(s)"}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <span>
                  {stats.totalContributions} {language === "zh" ? "次贡献" : "contributions"} {language === "zh" ? "在过去一年" : "in the last year"}
                </span>
                <div className="flex items-center gap-2">
                  <span>{language === "zh" ? "少" : "Less"}</span>
                  <div className="flex gap-[3px]">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-[11px] h-[11px] rounded-sm ${getHeatmapColor(level)}`}
                      />
                    ))}
                  </div>
                  <span>{language === "zh" ? "多" : "More"}</span>
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
            <span>{language === "zh" ? "了解更多" : "Learn More"}</span>
            <span>→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
