import { JSDOM } from 'jsdom';
import fs from 'fs';

(async () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  const jsFiles = html.match(/src="\/assets\/index-[^"]+\.js"/g).map(s => s.slice(5, -1));
  const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/blog" });
  dom.window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  dom.window.matchMedia = () => ({ matches: false });
  
  for (const file of jsFiles) {
    const code = fs.readFileSync('dist' + file, 'utf8');
    const script = dom.window.document.createElement("script");
    script.textContent = code;
    dom.window.document.body.appendChild(script);
  }
  
  setTimeout(() => {
    const root = dom.window.document.getElementById('root');
    console.log(root.textContent.substring(0, 500));
    console.log("INCLUDES 深度学习入门:", root.textContent.includes('深度学习入门'));
    console.log("INCLUDES 没有找到相关文章:", root.textContent.includes('没有找到相关文章'));
    process.exit(0);
  }, 2000);
})();
