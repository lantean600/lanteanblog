import { postsWithContent } from "./content";

export interface CollectionItem {
  slug: string;
  category: string;
  title: string;
  date: string;
  excerpt?: string;
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

/**
 * 集合的基础元数据定义（可选）
 * 如果文章中引用的 collection ID 在这里有定义，则使用这里的名称和描述
 * 如果没有定义，则直接以 ID 作为显示名称
 */
const COLLECTION_METADATA: Record<string, Omit<Collection, "id" | "items">> = {
  "pytorch-深度学习": {
    name: { zh: "pytorch-深度学习", en: "pytorch-deeplearning" },
    description: { zh: "《Pytorch实用教程》学习笔记", en: "PyTorch-Practical-Guide-Notes" },
  },
  "反思总结": {
    name: { zh: "反思总结", en: "Reflection-Summary" },
    description: { zh: "每周的学习和生活反思记录", en: "Weekly reflection on learning and life" },
  },
};

/**
 * 动态从所有文章中提取并汇总集合
 */
export function getAllCollections(): Collection[] {
  const collectionMap = new Map<string, CollectionItem[]>();

  // 1. 扫描所有文章，按 collection 归类
  postsWithContent.forEach(post => {
    if (post.collection) {
      const item: CollectionItem = {
        slug: post.slug,
        category: post.category,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
      };

      if (!collectionMap.has(post.collection)) {
        collectionMap.set(post.collection, []);
      }
      collectionMap.get(post.collection)!.push(item);
    }
  });

  // 2. 将归类后的数据转换为 Collection 数组
  const dynamicCollections = Array.from(collectionMap.entries()).map(([id, items]) => {
    const metadata = COLLECTION_METADATA[id] || {
      name: { zh: id, en: id },
      description: { zh: `关于 ${id} 的文章合集`, en: `A collection of posts about ${id}` },
    };

    return {
      id,
      ...metadata,
      items: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  });

  // 3. 补充预定义但暂时没有文章的集合
  const finalCollections = [...dynamicCollections];
  Object.keys(COLLECTION_METADATA).forEach(id => {
    if (!collectionMap.has(id)) {
      finalCollections.push({
        id,
        ...COLLECTION_METADATA[id],
        items: [],
      });
    }
  });

  // 4. 确保按照元数据定义的顺序排序（可选）
  const metadataOrder = Object.keys(COLLECTION_METADATA);
  return finalCollections.sort((a, b) => {
    const indexA = metadataOrder.indexOf(a.id);
    const indexB = metadataOrder.indexOf(b.id);
    if (indexA === -1 && indexB === -1) return a.id.localeCompare(b.id);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export function getCollectionById(id: string): Collection | null {
  const collections = getAllCollections();
  return collections.find((c) => c.id === id) || null;
}
