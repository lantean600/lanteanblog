/**
 * 统一的预计阅读时间计算
 * 支持中文和英文混合文本
 */

export const estimateReadMinutes = (text: string): number => {
  if (!text || typeof text !== 'string') return 1;

  let processedText = text;

  // 如果是 Markdown，去掉代码块、链接、图片等
  if (processedText.includes('```') || processedText.includes('[')) {
    processedText = processedText
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/[#>*_\-\[\]()]/g, ' ');
  }

  // 统一空白符
  processedText = processedText.replace(/\s+/g, ' ').trim();

  // 计算中文字符
  const cjkChars = (processedText.match(/[\u3400-\u9FFF]/g) || []).length;

  // 计算英文单词（包括数字）
  const latinWords = (processedText.match(/[A-Za-z0-9]+/g) || []).length;

  // 混合语言计算：中文按1个字=1字计，英文按1个单词=2字计
  // 总体按380字/分钟阅读速度计算
  const totalUnits = cjkChars + latinWords * 2;
  return Math.max(1, Math.ceil(totalUnits / 380));
};
