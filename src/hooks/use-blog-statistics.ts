import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  return value.slice(0, 10);
}

function getHeatLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0 || maxCount <= 0) {
    return 0;
  }

  const ratio = count / maxCount;

  if (ratio >= 0.8) return 4;
  if (ratio >= 0.55) return 3;
  if (ratio >= 0.3) return 2;
  return 1;
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

  const maxCount = Math.max(...counts.values(), 0);
  const cells: HeatmapCell[] = [];

  for (let i = 0; i < 364; i += 1) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    const key = current.toISOString().slice(0, 10);
    const count = counts.get(key) ?? 0;

    cells.push({
      date: key,
      count,
      level: getHeatLevel(count, maxCount),
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

      const [postsResult, statisticsResult] = await Promise.all([
        supabase
          .from("posts")
          .select("id, content, published_at, updated_at")
          .eq("is_deleted", false)
          .eq("is_published", true)
          .order("published_at", { ascending: false }),
        supabase
          .from("blog_statistics")
          .select("manual_adjustment")
          .eq("is_deleted", false)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (!isMounted) {
        return;
      }

      const posts = (postsResult.data ?? []) as PostRecord[];
      const statistics = (statisticsResult.data ?? null) as BlogStatisticsRecord | null;

      const totalWords =
        posts.reduce((sum, post) => sum + countWords(post.content ?? ""), 0) +
        Math.max(0, statistics?.manual_adjustment ?? 0);

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
