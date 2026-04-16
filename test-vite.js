import { createServer } from 'vite';

async function test() {
  const server = await createServer({
    configFile: './vite.config.ts',
    root: process.cwd(),
  });
  const result = await server.ssrLoadModule('./src/lib/content.ts');
  console.log('Posts:', result.getAllPosts());
  await server.close();
}
test();
