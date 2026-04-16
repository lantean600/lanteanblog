export type { Post } from "./generated-posts";
export {
  getAllPosts,
  getAllTags,
  getPostBySlug,
  getPostBySlugAny,
  getPostsByCategory,
  posts as postsWithContent,
  searchPosts,
} from "./generated-posts";

export const categories = ["research", "technical", "daily", "journal"] as const;

export type Category = (typeof categories)[number];
