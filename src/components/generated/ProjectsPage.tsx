import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "智能文档助手",
      description: "基于 AI 的文档自动化工具，支持智能分类、摘要生成和关键词提取。",
      tags: ["React", "Python", "AI"],
      demo: "#",
      code: "#",
      period: "2025.12 - 2026.03",
    },
    {
      id: 2,
      title: "个人博客系统",
      description: "功能完整的博客平台，支持 Markdown 编辑、分类标签、评论系统等功能。",
      tags: ["React", "Node.js", "PostgreSQL"],
      demo: "#",
      code: "#",
      period: "2025.06 - 2025.11",
    },
    {
      id: 3,
      title: "在线协作白板",
      description: "实时多人协作白板工具，支持绘图、便签、投票等功能。",
      tags: ["WebSocket", "Canvas", "React"],
      demo: "#",
      code: "#",
      period: "2025.01 - 2025.05",
    },
    {
      id: 4,
      title: "任务管理应用",
      description: "简洁高效的任务管理工具，支持看板视图、提醒和团队协作。",
      tags: ["Vue", "Firebase", "PWA"],
      demo: "#",
      code: "#",
      period: "2024.09 - 2024.12",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            项目作品
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            展示我参与和开发的个人项目
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
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
              <div className="flex items-center gap-4">
                <a
                  href={project.demo}
                  className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                  <span>查看演示</span>
                </a>
                <a
                  href={project.code}
                  className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>查看代码</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
