import imageVariants from "../data/image-variants.json";

const DEFAULT_HERO_IMAGE = "/images/kayuya.jpg";

function normalizeImagePath(image?: string) {
  if (!image || image === "/assets/kayuya.jpg" || image === DEFAULT_HERO_IMAGE) {
    return DEFAULT_HERO_IMAGE;
  }

  if (image.startsWith("/public/images/")) {
    return image.replace("/public", "");
  }

  return image;
}

export function getImagePaths(image?: string) {
  const normalized = normalizeImagePath(image);

  if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("data:")) {
    return { original: normalized, optimized: null as string | null };
  }

  const optimized = (imageVariants as Record<string, string>)[normalized] || null;
  return {
    original: normalized,
    optimized: optimized && optimized !== normalized ? optimized : null,
  };
}

export function resolveOptimizedImage(image?: string) {
  const { original, optimized } = getImagePaths(image);
  return optimized || original;
}

export { DEFAULT_HERO_IMAGE };
