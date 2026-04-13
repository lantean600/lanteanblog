import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export function AcademicPage() {
  const projects = [
    {
      id: 1,
      title: "多模态具身智能研究",
      description: "研究如何让机器人通过视觉、语言等多模态信息理解环境并执行复杂任务。",
      tags: ["AI", "Robotics", "Multimodal"],
      link: "#",
      paper: "#",
      period: "2024.07 - Present",
    },
    {
      id: 2,
      title: "高效 Transformer 架构优化",
      description: "探索降低 Transformer 模型计算复杂度的方法，提升推理效率。",
      tags: ["Deep Learning", "NLP", "Optimization"],
      link: "#",
      paper: "#",
      period: "2023.09 - 2024.06",
    },
    {
      id: 3,
      title: "基于图神经网络的知识图谱推理",
      description: "利用图神经网络进行知识图谱补全和关系推理。",
      tags: ["GNN", "Knowledge Graph", "AI"],
      link: "#",
      paper: "#",
      period: "2022.09 - 2023.08",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            学术研究
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            展示我的研究成果和学术论文
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
                  <span>查看项目</span>
                </a>
                <a
                  href={project.paper}
                  className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                  <span>查看论文</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
