import { JSDOM } from 'jsdom';
import fs from 'fs';

(async () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  
  // Find all <script type="module" crossorigin src="/assets/index-xxx.js"></script>
  const jsFiles = html.match(/src="\/assets\/index-[^"]+\.js"/g).map(s => s.slice(5, -1));
  
  const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/blog" });
  
  // Inject the JS files
  for (const file of jsFiles) {
    const code = fs.readFileSync('dist' + file, 'utf8');
    const script = dom.window.document.createElement("script");
    script.textContent = code;
    dom.window.document.body.appendChild(script);
  }
  
  setTimeout(() => {
    console.log(dom.window.document.body.textContent.substring(0, 500));
    console.log("INCLUDES 深度学习:", dom.window.document.body.textContent.includes('深度学习'));
    console.log("INCLUDES DEBUG:", dom.window.document.body.textContent.includes('DEBUG POSTS'));
    process.exit(0);
  }, 2000);
})();
