import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

(async () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable", url: "http://localhost" });
  
  // Wait for React to render
  setTimeout(() => {
    console.log(dom.window.document.body.textContent);
    console.log("INCLUDES DEBUG:", dom.window.document.body.textContent.includes('DEBUG POSTS'));
    console.log("INCLUDES 深度学习入门:", dom.window.document.body.textContent.includes('深度学习入门'));
    process.exit(0);
  }, 2000);
})();
