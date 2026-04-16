import { useEffect, useMemo, useState } from "react";
import { postsWithContent as localPosts } from "../lib/content";

type PostRecord = {
  id: string;
  content: string;
  published_at: string | null;
  updated_at: string;
};

type BlogStatisticsRecord = {
  manual_adjustment: number | null;
};

export type HeatmapCell = {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
};

export type BlogStatisticsData = {
  daysOnline: number;
  lastUpdated: string;
  totalWords: number;
  totalPosts: number;
  totalContributions: number;
  heatmap: HeatmapCell[];
};

const DEFAULT_STATS: BlogStatisticsData = {
  daysOnline: 1,
  lastUpdated: "--",
  totalWords: 0,
  totalPosts: 0,
  totalContributions: 0,
  heatmap: [],
};

function countWords(content: string) {
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const englishWords = (content.match(/[A-Za-z0-9_-]+/g) ?? []).length;
  return chineseChars + englishWords;
}

function formatDate(dateString: string, locale: string) {
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

function getYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function calculateDaysOnline() {
  const start = getYesterday();
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
}

function toDateKey(value: string) {
  // 直接使用字符串的前10位，避免时区问题
  return value.slice(0, 10);
}

function toLocalDateKey(date: Date) {
  // 使用本地日期而不是 toISOString()，避免时区偏移问题
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getHeatLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  // 根据文章数量决定颜色级别
  // 0篇 = 灰色(level 0)
  // 1篇 = 浅绿(level 1)
  // 2篇 = 中绿(level 2)
  // 3篇 = 深绿(level 3)
  // 4篇及以上 = 最深绿(level 4)
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

function buildHeatmap(posts: PostRecord[]) {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 363);

  const counts = new Map<string, number>();

  for (const post of posts) {
    const sourceDate = post.published_at || post.updated_at;

    if (!sourceDate) {
      continue;
    }

    const key = toDateKey(sourceDate);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const cells: HeatmapCell[] = [];

  for (let i = 0; i < 364; i += 1) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    const key = toLocalDateKey(current);
    const count = counts.get(key) ?? 0;

    cells.push({
      date: key,
      count,
      level: getHeatLevel(count),
    });
  }

  return cells;
}

export function useBlogStatistics(language: "zh" | "en") {
  const [stats, setStats] = useState<BlogStatisticsData>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStatistics() {
      setLoading(true);

      // 从本地 Markdown 文件获取数据
      const posts: PostRecord[] = localPosts.map((post) => ({
        id: post.slug,
        content: post.content || "",
        published_at: post.date,
        updated_at: post.date,
      }));

      if (!isMounted) {
        return;
      }

      const totalWords = posts.reduce((sum, post) => sum + countWords(post.content ?? ""), 0);

      const latestUpdatedAt =
        posts
          .map((post) => post.published_at || post.updated_at)
          .filter(Boolean)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;

      setStats({
        daysOnline: calculateDaysOnline(),
        lastUpdated: latestUpdatedAt ? formatDate(latestUpdatedAt, language === "zh" ? "zh-CN" : "en-US") : "--",
        totalWords,
        totalPosts: posts.length,
        totalContributions: posts.length,
        heatmap: buildHeatmap(posts),
      });

      setLoading(false);
    }

    loadStatistics().catch(() => {
      if (isMounted) {
        setStats(DEFAULT_STATS);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [language]);

  const displayStats = useMemo(() => {
    return {
      ...stats,
      totalWordsLabel: stats.totalWords.toLocaleString(language === "zh" ? "zh-CN" : "en-US"),
    };
  }, [language, stats]);

  return {
    stats: displayStats,
    loading,
  };
}
