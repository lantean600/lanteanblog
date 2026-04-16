import { JSDOM } from 'jsdom';
import fs from 'fs';

(async () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  const jsFiles = html.match(/src="\/assets\/index-[^"]+\.js"/g).map(s => s.slice(5, -1));
  const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });
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
    console.log(root.textContent.substring(0, 1000));
    console.log("INCLUDES 7 篇文章:", root.textContent.includes('7')); // Expect 7 total posts
    process.exit(0);
  }, 2000);
})();
