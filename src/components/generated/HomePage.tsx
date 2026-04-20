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

export function HomePage() {
  const { language } = useLanguage();
  const { totalPosts, totalWords, daysOnline, lastUpdate, heatmap, totalContributions } = useBlogStatistics();

  const isDark = document.documentElement.classList.contains('dark');

  const monthLabels: { weekIndex: number; month: number }[] = [];
  if (heatmap && heatmap.length > 0) {
    let currentMonth = -1;
    for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
      const day = heatmap[weekIndex * 7];
      if (!day) continue;
      // parse date properly avoiding timezone shift
      const [year, monthStr, dayStr] = day.date.split('-');
      const dateObj = new Date(parseInt(year), parseInt(monthStr) - 1, parseInt(dayStr));
      const month = dateObj.getMonth();
      
      // 只在月份真正发生变化且不与前一个标签距离过近（例如距离至少 3 周）时才添加标签
      if (month !== currentMonth) {
        if (monthLabels.length === 0 || weekIndex - monthLabels[monthLabels.length - 1].weekIndex >= 3) {
          monthLabels.push({ weekIndex, month });
          currentMonth = month;
        }
      }
    }
  }

  const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen pt-20 pb-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16 animate-softReveal">
          <div className="focus-halo flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={avatarFallback}
              alt="Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-[1.25rem] object-cover border border-border/70 shadow-[0_18px_34px_hsla(210,26%,16%,0.18)]"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-4 font-heading text-5xl text-foreground md:text-6xl">
                Lantean
              </h1>
              <div className="mb-4 flex items-center justify-center space-x-3 md:justify-start">
                <a
                  href="https://github.com/lantean600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rounded-full border border-border/75 bg-card/70 px-4 py-2 transition-all duration-300 hover:border-primary/40 hover:text-primary"
                >
                  <FaGithub className="w-5 h-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a
                  href="mailto:614635562@qq.com"
                  className="flex items-center space-x-2 rounded-full border border-border/75 bg-card/70 px-4 py-2 transition-all duration-300 hover:border-primary/40 hover:text-primary"
                >
                  <FaEnvelope className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {language === "zh" ? "邮箱" : "614635562@qq.com"}
                  </span>
                </a>
                <div className="flex items-center space-x-2 rounded-full border border-border/75 bg-card/70 px-4 py-2">
                  <span className="text-sm font-medium">
                    {language === "zh" ? "中国" : "China"}
                  </span>
                </div>
              </div>
              <p className="max-w-2xl text-muted-foreground leading-relaxed">
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
              <h2 className="font-heading text-2xl text-foreground sticky top-24">
                {language === "zh" ? "教育经历" : "Education"}
              </h2>
            </div>
            <div className="flex-1 space-y-4">
              <div className="md:hidden mb-4">
                <h2 className="font-heading text-2xl text-foreground">
                  {language === "zh" ? "教育经历" : "Education"}
                </h2>
              </div>
              <div className="glass-card rounded-2xl p-5 transition-all duration-200 hover:border-foreground/20">
                <h3 className="mb-1 font-heading text-2xl text-foreground">太原理工大学</h3>
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
              <h2 className="font-heading text-2xl text-foreground sticky top-24">
                {language === "zh" ? "数据统计" : "Statistics"}
              </h2>
            </div>
            <div className="flex-1">
              <div className="md:hidden mb-4">
                <h2 className="font-heading text-2xl text-foreground">
                  {language === "zh" ? "数据统计" : "Statistics"}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {daysOnline}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === "zh" ? "天在线" : "Days Online"}
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5">
                <div className="text-2xl font-bold text-primary mb-2">
                  {lastUpdate}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === "zh" ? "最后更新" : "Last Updated"}
                </div>
              </div>
                <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {totalWords >= 10000
                      ? `${(totalWords / 10000).toFixed(1)}w`
                      : totalWords.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === "zh" ? "总字数" : "Total Words"}
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === "zh" ? "文章总数" : "Total Posts"}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {totalPosts}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contribution Heatmap Section */}
        <section className="mb-16">
          <div className="glass-card overflow-x-auto rounded-2xl p-6">
            <div className="min-w-[650px]">
              {/* Month labels */}
              <div className="relative h-6 mb-1 ml-[34px]">
                {monthLabels.map((label, i) => (
                  <div
                    key={i}
                    className="absolute text-xs text-muted-foreground whitespace-nowrap"
                    style={{ left: `${label.weekIndex * 14}px` }}
                  >
                    {monthsNames[label.month]}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-2">
                {/* Day labels */}
                <div className="flex flex-col gap-[3px] justify-between text-xs text-muted-foreground py-[2px] w-[26px]">
                  {dayNames.map((day, i) => (
                    <div key={i} className="h-[11px] leading-[11px] text-right pr-1">
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
                          const cell = heatmap[cellIndex];
                          const level = cell?.level ?? 0;
                          const count = cell?.count ?? 0;
                          const date = cell?.date ?? '';
                          
                          return (
                            <div
                              key={`${weekIndex}-${dayIndex}`}
                              className={`w-[11px] h-[11px] rounded-sm ${getHeatmapColor(level, isDark)} hover:opacity-80 transition-opacity cursor-pointer`}
                              title={`${date}: ${count} contribution(s)`}
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
                  {totalContributions} contributions in the last year
                </span>
                <div className="flex items-center gap-2">
                  <span>Less</span>
                  <div className="flex gap-[3px]">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-[11px] h-[11px] rounded-sm ${getHeatmapColor(level, isDark)}`}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Link
            to="/about"
            className="inline-flex items-center space-x-2 rounded-full border border-primary/35 px-5 py-2 text-primary transition-colors hover:border-primary/70 hover:text-primary/80"
          >
            <span>{language === "zh" ? "了解更多" : "Learn More"}</span>
            <span>→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
