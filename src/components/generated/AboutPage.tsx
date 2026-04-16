import { FaGithub, FaEnvelope, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import avatarFallback from "@/assets/avatar-fallback.svg";
import { useLanguage } from "@/context/LanguageContext";

export function AboutPage() {
  const { language } = useLanguage();
  const skills = [
    { category: language === "zh" ? "编程语言" : "Languages", items: ["Python", "JavaScript", "TypeScript", "C++"] },
    { category: language === "zh" ? "框架" : "Frameworks", items: ["React", "PyTorch", "TensorFlow", "Node.js"] },
    { category: language === "zh" ? "工具" : "Tools", items: ["Git", "Docker", "Linux", "PostgreSQL"] },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src={avatarFallback}
            alt="Avatar"
            className="w-32 h-32 mx-auto rounded-2xl object-cover border-2 border-border shadow-lg mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "zh" ? "关于我" : "About Me"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "zh"
              ? "你好！我是 Lantean，一名热爱技术的开发者和研究者。"
              : "Hi, I'm Lantean, a developer and researcher passionate about technology."}
          </p>
        </div>

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {language === "zh" ? "详细介绍" : "Introduction"}
          </h2>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground leading-relaxed">
              {language === "zh"
                ? "我对人工智能、深度学习、自然语言处理等领域充满热情，喜欢探索前沿技术并将其应用于实际问题。"
                : "I'm passionate about AI, deep learning, and NLP, and enjoy applying cutting-edge tech to real-world problems."}
            </p>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2" />
            {language === "zh" ? "教育经历" : "Education"}
          </h2>
          <div className="space-y-4">
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-foreground">太原理工大学</h3>
                  <p className="text-sm text-muted-foreground">软件工程专业</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  2025 年 9 月 - 至今
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{language === "zh" ? "本科" : "Bachelor's Degree"}</p>
            </div>
          </div>
        </section>

        {/* Research Areas */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {language === "zh" ? "研究方向" : "Research Areas"}
          </h2>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">
              {language === "zh"
                ? "多模态学习、具身智能、自然语言处理、深度学习"
                : "Multimodal Learning, Embodied AI, Natural Language Processing, Deep Learning"}
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {language === "zh" ? "技能栈" : "Skills"}
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
            {language === "zh" ? "联系方式" : "Contact"}
          </h2>
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  {language === "zh" ? "邮箱：614635562@qq.com" : "Email: 614635562@qq.com"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaGithub className="w-5 h-5 text-primary" />
                <a
                  href="https://github.com/lantean600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  github.com/lantean600
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  {language === "zh" ? "所在地：中国·太原" : "Location: Taiyuan, China"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
