const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5173/blog', { waitUntil: 'networkidle0' });
  
  const content = await page.evaluate(() => {
    return document.body.innerText;
  });
  
  console.log("PAGE TEXT CONTAINS '没有找到相关文章':", content.includes('没有找到相关文章') || content.includes('No articles found'));
  
  await browser.close();
})();
