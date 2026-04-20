import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export function ProjectsPage() {
  const { language } = useLanguage();
  const projects = [
    {
      id: 1,
      title: language === "zh" ? "智能文档助手（样例）" : "Smart Document Assistant (Sample)",
      description: language === "zh"
        ? "样例数据：基于 AI 的文档自动化工具，支持智能分类、摘要生成和关键词提取。"
        : "Sample entry: an AI-powered document automation tool for classification, summarization, and keyword extraction.",
      tags: ["React", "Python", "AI"],
      demo: "https://example.com/",
      code: "https://github.com/",
      period: "2025.12 - 2026.03",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="poetic-title mb-2">Craft & Build</p>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            {language === "zh" ? "项目作品" : "Projects"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "zh"
              ? "展示我参与和开发的个人项目"
              : "A collection of projects I built and contributed to"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20"
            >
              <div className="mb-4">
                <span className="poetic-title text-[0.65rem]">
                  {project.period}
                </span>
              </div>
              <h3 className="font-heading text-3xl text-foreground mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/70 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.1em] text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={project.demo}
                  className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                  <span>{language === "zh" ? "查看演示" : "Live Demo"}</span>
                </a>
                <a
                  href={project.code}
                  className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>{language === "zh" ? "查看代码" : "Source Code"}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
