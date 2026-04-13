import { FaGithub, FaEnvelope, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";

export function AboutPage() {
  const skills = [
    { category: "编程语言", items: ["Python", "JavaScript", "TypeScript", "C++"] },
    { category: "框架", items: ["React", "PyTorch", "TensorFlow", "Node.js"] },
    { category: "工具", items: ["Git", "Docker", "Linux", "PostgreSQL"] },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="https://baas-api.wanwang.xin/toc/image/preview/professional-avatar-large.jpg?w=200&h=200&q=85"
            alt="Avatar"
            className="w-32 h-32 mx-auto rounded-2xl object-cover border-2 border-border shadow-lg mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            关于我
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            你好！我是 Lantean，一名热爱技术的开发者和研究者。
          </p>
        </div>

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">
            详细介绍
          </h2>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground leading-relaxed mb-4">
              我目前在上海人工智能实验室具身智能中心实习，专注于多模态学习和机器人控制方向的研究。
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              在此之前，我在西安交通大学攻读人工智能专业学士学位，打下了坚实的理论基础。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              我对人工智能、深度学习、自然语言处理等领域充满热情，喜欢探索前沿技术并将其应用于实际问题。
            </p>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2" />
            教育经历
          </h2>
          <div className="space-y-4">
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-foreground">上海人工智能实验室</h3>
                  <p className="text-sm text-muted-foreground">具身智能中心</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  2024 年 7 月 - 至今
                </span>
              </div>
              <p className="text-sm text-muted-foreground">实习生</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-foreground">西安交通大学</h3>
                  <p className="text-sm text-muted-foreground">人工智能专业</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  2022 年 9 月 - 至今
                </span>
              </div>
              <p className="text-sm text-muted-foreground">本科</p>
            </div>
          </div>
        </section>

        {/* Research Areas */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">
            研究方向
          </h2>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">
              多模态学习、具身智能、自然语言处理、深度学习
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">
            技能栈
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.category}
                className="p-4 bg-card border border-border rounded-lg"
              >
                <h3 className="font-semibold text-foreground mb-3">
                  {skill.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <FaEnvelope className="w-5 h-5 mr-2" />
            联系方式
          </h2>
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  邮箱：contact@lantean.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaGithub className="w-5 h-5 text-primary" />
                <a
                  href="https://github.com/lantean"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  github.com/lantean
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  所在地：中国·上海
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
