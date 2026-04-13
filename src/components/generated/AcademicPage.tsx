import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export function AcademicPage() {
  const { language } = useLanguage();
  const projects = [
    {
      id: 1,
      title: language === "zh" ? "多模态具身智能研究（样例）" : "Multimodal Embodied AI Research (Sample)",
      description: language === "zh"
        ? "样例数据：研究如何让机器人通过视觉、语言等多模态信息理解环境并执行复杂任务。"
        : "Sample entry: exploring how robots understand environments and perform tasks with multimodal signals such as vision and language.",
      tags: ["AI", "Robotics", "Multimodal"],
      link: "https://github.com/",
      paper: "https://arxiv.org/",
      period: "2024.07 - Present",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "zh" ? "学术研究" : "Academic Research"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "zh"
              ? "展示我的研究成果和学术论文"
              : "Showcasing my research projects and publications"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 bg-card border border-border rounded-lg hover:border-foreground/20 hover:bg-muted/30 hover:shadow-lg transition-all duration-200"
            >
              <div className="mb-4">
                <span className="text-xs text-muted-foreground font-mono">
                  {project.period}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={project.link}
                  className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>{language === "zh" ? "查看项目" : "Project"}</span>
                </a>
                <a
                  href={project.paper}
                  className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                  <span>{language === "zh" ? "查看论文" : "Paper"}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
