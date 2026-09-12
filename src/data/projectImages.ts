import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>(
	'../assets/projects/*.{avif,webp,png,jpg,jpeg}',
	{ eager: true }
);

const imagesBySlug = new Map(
	Object.entries(images).map(([path, image]) => [
		path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.')),
		image.default,
	])
);

export const getProjectImage = (slug: string) => imagesBySlug.get(slug);
