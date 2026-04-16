import express from 'express';
import { JSDOM } from 'jsdom';
const app = express();
app.use(express.static('dist'));
app.listen(8080, async () => {
  const dom = await JSDOM.fromURL('http://localhost:8080/', { runScripts: "dangerously", resources: "usable" });
  setTimeout(() => {
    console.log(dom.window.document.getElementById('root').innerHTML.substring(0, 200));
    process.exit(0);
  }, 3000);
});
