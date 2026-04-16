export interface CollectionItem {
  slug: string;
  category: string;
  title: string;
  date: string;
}

export interface Collection {
  id: string;
  name: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  items: CollectionItem[];
}

export const collections: Collection[] = [
  {
    id: "deep-learning-notes",
    name: {
      zh: "深度学习笔记",
      en: "Deep Learning Notes",
    },
    description: {
      zh: "记录深度学习相关的学习笔记和实践经验",
      en: "Study notes and practical experiences on deep learning",
    },
    items: [
      {
        slug: "2026-04-16-deep-learning-intro",
        category: "daily",
        title: "深度学习入门：从零开始理解神经网络",
        date: "2026-04-16",
      },
      {
        slug: "2026-04-14-pytorch-note",
        category: "daily",
        title: "PyTorch 学习笔记",
        date: "2026-04-14",
      },
      {
        slug: "2026-04-10-transformer-architecture",
        category: "research",
        title: "Transformer 架构详解",
        date: "2026-04-10",
      },
    ],
  },
  {
    id: "frontend-performance",
    name: {
      zh: "前端性能优化",
      en: "Frontend Performance",
    },
    description: {
      zh: "前端性能优化的实践经验和技巧",
      en: "Practical experiences and tips on frontend performance optimization",
    },
    items: [
      {
        slug: "2026-04-05-react-performance",
        category: "technical",
        title: "React 性能优化指南",
        date: "2026-04-05",
      },
    ],
  },
  {
    id: "weekly-reflection",
    name: {
      zh: "每周反思",
      en: "Weekly Reflection",
    },
    description: {
      zh: "每周的学习和生活反思记录",
      en: "Weekly reflection on learning and life",
    },
    items: [
      {
        slug: "2026-04-01-q1-summary",
        category: "journal",
        title: "2026 Q1 季度总结",
        date: "2026-04-01",
      },
    ],
  },
];

export function getCollectionById(id: string): Collection | null {
  return collections.find((c) => c.id === id) || null;
}

export function getAllCollections(): Collection[] {
  return collections;
}
