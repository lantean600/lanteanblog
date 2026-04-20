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
    <div className="min-h-screen pt-24 pb-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="poetic-title mb-2">Research Ledger</p>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
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
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
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
