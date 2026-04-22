import sharp from 'sharp';
import path from 'node:path';

const workspaceRoot = path.resolve(process.cwd());
const avatarSource = path.join(workspaceRoot, 'public', 'images', 'avatar-fallback.svg');
const outputFile = path.join(workspaceRoot, 'public', 'images', 'share-card.png');

const width = 1200;
const height = 630;

const background = {
  r: 245,
  g: 241,
  b: 234,
  alpha: 1,
};

const cardSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f9f4ec" />
      <stop offset="55%" stop-color="#f1eadf" />
      <stop offset="100%" stop-color="#e8ded1" />
    </linearGradient>
    <radialGradient id="a" cx="18%" cy="18%" r="55%">
      <stop offset="0%" stop-color="rgba(28,115,109,0.22)" />
      <stop offset="100%" stop-color="rgba(28,115,109,0)" />
    </radialGradient>
    <radialGradient id="b" cx="84%" cy="20%" r="55%">
      <stop offset="0%" stop-color="rgba(208,164,120,0.18)" />
      <stop offset="100%" stop-color="rgba(208,164,120,0)" />
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="rgba(51,40,27,0.18)" />
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#a)" />
  <rect width="1200" height="630" fill="url(#b)" />
  <circle cx="1040" cy="510" r="170" fill="rgba(255,255,255,0.18)" />
  <circle cx="210" cy="120" r="130" fill="rgba(255,255,255,0.14)" />
  <rect x="70" y="70" width="1060" height="490" rx="42" fill="rgba(255,255,255,0.38)" stroke="rgba(95,78,58,0.10)" />
  <g filter="url(#shadow)">
    <rect x="126" y="140" width="350" height="350" rx="40" fill="rgba(255,255,255,0.86)" stroke="rgba(95,78,58,0.14)" />
  </g>
  <text x="548" y="232" fill="#24413f" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" letter-spacing="2">Lantean's Blog</text>
  <text x="548" y="292" fill="#53625f" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500">Technical notes, research, and daily writing</text>
  <text x="548" y="360" fill="#6c5a49" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" letter-spacing="3">NOTES &amp; RESEARCH</text>
  <text x="548" y="432" fill="#7d7d7d" font-family="Arial, Helvetica, sans-serif" font-size="20">lanteanblog.pages.dev</text>
</svg>
`;

const avatar = await sharp(avatarSource)
  .resize(280, 280, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp({
  create: {
    width,
    height,
    channels: 4,
    background,
  },
})
  .composite([
    { input: Buffer.from(cardSvg), top: 0, left: 0 },
    { input: avatar, top: 175, left: 160 },
  ])
  .png()
  .toFile(outputFile);

console.log(`Created ${outputFile}`);
