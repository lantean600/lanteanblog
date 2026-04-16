const str = "---\ntitle: \"深度学习入门\"\n---\n\n# 深度学习";
const match = str.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
console.log(match ? "MATCH" : "NO MATCH");
