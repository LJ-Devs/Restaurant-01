import type { ImageMetadata } from 'astro';

/**
 * Photos of the active client: `@client-images` points to src/assets/images/<id>/
 * (set in astro.config.ts). Only the photos a page uses are optimised and published.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('@client-images/*.{jpg,jpeg,png,webp,avif,svg}');

/** Loads a photo of the active client by file name, for Astro's <Image> / <Picture>. */
export async function loadImage(file: string): Promise<ImageMetadata> {
  const key = Object.keys(files).find((path) => path.split('/').pop() === file);
  if (!key) {
    throw new Error(
      `Photo not found: "${file}". Put it in src/assets/images/<id>/ and check the file name in your site config (it is case-sensitive).`,
    );
  }
  return (await files[key]()).default;
}
