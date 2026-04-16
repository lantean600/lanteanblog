import matter from "gray-matter";

// 静态导入所有 Markdown 文件
const markdownModules = import.meta.glob("../content/**/*.md", {
  eager: true,
  import: "default",
});

console.log("=== DEBUG markdownModules ===");
console.log("Object keys:", Object.keys(markdownModules));

for (const [path, content] of Object.entries(markdownModules)) {
  console.log("\n--- File:", path);
  console.log("Content type:", typeof content);
  console.log("Content length:", (content as string)?.length || 0);
  console.log("Content preview:", (content as string)?.substring(0, 200));
  
  try {
    const result = matter(content as string);
    console.log("matter result data:", result.data);
  } catch (error) {
    console.error("matter error:", error);
  }
}

export {};