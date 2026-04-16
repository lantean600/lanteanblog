const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/content/**/*.md');
let allMatch = true;
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    console.log("FAIL:", f);
    allMatch = false;
  }
}
if (allMatch) console.log("ALL MATCH");
