import { useEffect, useRef } from 'react';

/**
 * The portrait drawn with the hero's own cells, resolving into the photograph as
 * it is scrolled into view.
 *
 * The hero spells SOFTWARE ENGINEER out of contribution tiles; this reuses the
 * same grid so the section reads as a continuation rather than a new idea. At
 * rest the face is a four-level posterisation in clay — legible as a portrait,
 * plainly made of tiles. As it enters the viewport the tiles grow to the full
 * pitch, lose their corners and pick up the photograph's own colour, so the
 * mosaic closes into a photograph without ever cutting between two images.
 *
 * Two things are done to the pixels on the way in:
 *
 *   - A radial fall-off centred on the face mixes the outer cells into the
 *     section's ground. The source was shot against white brick, and dropping a
 *     white rectangle onto a dark page reads as a sticker; this way the frame
 *     has no edge, it just runs out.
 *   - Everything is warmed and its blacks are lifted onto the ground colour, so
 *     the photograph belongs to the same light as the section around it.
 *
 * Scroll drives it from a rAF loop rather than a scroll timeline, because the
 * value is needed as a number inside canvas rather than as a CSS animation. The
 * loop only runs while the element is on screen, and reduced motion skips
 * straight to the resolved photograph.
 */

interface ContributionPortraitProps {
	src: string;
	/** Describes the photograph: the canvas stands in for an image. */
	alt: string;
	className?: string;
}

type Rgb = [number, number, number];

/** Cell pitch the grid aims for, and the bounds on how many columns it resolves. */
const TARGET_PITCH = 9;
const MIN_COLUMNS = 26;
const MAX_COLUMNS = 62;

/** Portrait crop, as rows per column. */
const ASPECT = 5 / 4;

/** Dark to light, quantised from the photograph's luminance. */
const CLAY_RAMP = ['#3d2a20', '#7d5540', '#bb8d73', '#e9d3c6'];

/** Ground the outer cells melt into. Matches --color-umber-950. */
const GROUND: Rgb = [16, 13, 12];

/** Share of the resolve spent waiting: how far apart first and last cell start. */
const SPREAD = 0.55;

/** Where the face sits in the frame, as a fraction of the crop. */
const FOCUS_X = 0.5;
const FOCUS_Y = 0.4;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const toRgb = (hex: string): Rgb => {
	const int = parseInt(hex.replace('#', ''), 16);
	return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const hash2 = (x: number, y: number) => {
	let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const ContributionPortrait = ({ src, alt, className = '' }: ContributionPortraitProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const hasRoundRect = typeof ctx.roundRect === 'function';
		const clayRgb = CLAY_RAMP.map(toRgb);

		let disposed = false;
		let ready = false;
		let columns = 0;
		let rows = 0;
		let pitch = 0;
		let frame: number | null = null;
		let onScreen = false;

		/** Per cell, in reading order. */
		let graded = new Uint8ClampedArray(0);
		let levels = new Uint8Array(0);
		let delays = new Float32Array(0);

		const image = new Image();
		image.decoding = 'async';

		/** Columns that put the cells nearest the target pitch, within the bounds. */
		const pickColumns = () =>
			Math.min(
				MAX_COLUMNS,
				Math.max(MIN_COLUMNS, Math.round((container.clientWidth || 1) / TARGET_PITCH))
			);

		/**
		 * Rasterise the photograph straight down to one pixel per cell. The browser's
		 * own downscale is the box filter we want, and it means the grade below runs
		 * over a few thousand values instead of a few million.
		 */
		const sample = () => {
			const offscreen = document.createElement('canvas');
			offscreen.width = columns;
			offscreen.height = rows;

			const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
			if (!offCtx) return false;

			// Cover-fit: fill the crop and let the overflow fall outside it.
			const scale = Math.max(columns / image.width, rows / image.height);
			const width = image.width * scale;
			const height = image.height * scale;

			offCtx.imageSmoothingEnabled = true;
			offCtx.imageSmoothingQuality = 'high';
			offCtx.drawImage(image, (columns - width) * FOCUS_X, (rows - height) * FOCUS_Y, width, height);

			const { data } = offCtx.getImageData(0, 0, columns, rows);
			const count = columns * rows;

			graded = new Uint8ClampedArray(count * 3);
			levels = new Uint8Array(count);
			delays = new Float32Array(count);

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < columns; col++) {
					const index = row * columns + col;
					const source = index * 4;

					const r = data[source];
					const g = data[source + 1];
					const b = data[source + 2];

					// Perceptual weights: the level has to track how bright a cell looks,
					// not how much light it carries.
					const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
					levels[index] =
						luminance < 0.22 ? 0 : luminance < 0.45 ? 1 : luminance < 0.72 ? 2 : 3;

					// Distance from the face, in units where 1 is the edge of the fall-off.
					const u = (col + 0.5) / columns;
					const v = (row + 0.5) / rows;
					const distance = Math.hypot((u - 0.5) / 0.66, (v - 0.44) / 0.76);
					const presence = 1 - smoothstep(clamp01((distance - 0.5) / 0.62));

					// Warm the photograph, then float it on the ground rather than cutting
					// it out: at the edges `presence` is zero and the cell is the ground.
					const warm: Rgb = [
						(r - 128) * 1.06 + 128 + 6,
						(g - 128) * 1.04 + 128 - 2,
						(b - 128) * 1.02 + 128 - 14,
					];

					const target = index * 3;
					graded[target] = GROUND[0] + (warm[0] - GROUND[0]) * presence;
					graded[target + 1] = GROUND[1] + (warm[1] - GROUND[1]) * presence;
					graded[target + 2] = GROUND[2] + (warm[2] - GROUND[2]) * presence;

					// Resolves top down, so the eyes arrive first, with enough scatter that
					// the front is a broken edge instead of a horizontal line.
					delays[index] = clamp01((row / Math.max(1, rows - 1)) * 0.7 + hash2(col, row) * 0.3);
				}
			}

			return true;
		};

		const layout = () => {
			const width = container.clientWidth;
			if (!width) return;

			columns = pickColumns();
			pitch = width / columns;
			rows = Math.round(columns * ASPECT);

			const cssHeight = rows * pitch;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);

			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(cssHeight * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${cssHeight}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			ready = sample();
		};

		/** How far the resolve has run: 0 below the fold, 1 once it is properly in view. */
		const progress = () => {
			if (prefersReducedMotion) return 1;

			const rect = container.getBoundingClientRect();
			const viewport = window.innerHeight || 1;
			const start = viewport * 0.94;
			const end = viewport * 0.3;

			return clamp01((start - rect.top) / (start - end));
		};

		const draw = () => {
			if (!ready) return;

			const p = progress();

			ctx.clearRect(0, 0, columns * pitch, rows * pitch);

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < columns; col++) {
					const index = row * columns + col;

					const local = easeOutCubic(clamp01((p - delays[index] * SPREAD) / (1 - SPREAD)));

					// Tiles at rest, seamless pixels once resolved. The half-pixel of bleed
					// closes the rounding seams that would otherwise grid the photograph.
					const size = pitch * (0.78 + 0.22 * local) + local * 0.5;
					const inset = (pitch - size) / 2;
					const radius = Math.max(0, pitch * 0.2 * (1 - local));

					const from = clayRgb[levels[index]];
					const target = index * 3;

					const r = from[0] + (graded[target] - from[0]) * local;
					const g = from[1] + (graded[target + 1] - from[1]) * local;
					const b = from[2] + (graded[target + 2] - from[2]) * local;

					ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;

					const x = col * pitch + inset;
					const y = row * pitch + inset;

					if (hasRoundRect && radius > 0.4) {
						ctx.beginPath();
						ctx.roundRect(x, y, size, size, radius);
						ctx.fill();
					} else {
						ctx.fillRect(x, y, size, size);
					}
				}
			}

			return p;
		};

		// Only runs while the portrait is on screen, and stops once it has fully
		// resolved and nothing else can change.
		const tick = () => {
			const p = draw();
			frame = onScreen && p !== undefined && p < 1 ? requestAnimationFrame(tick) : null;
		};

		const wake = () => {
			if (frame === null) frame = requestAnimationFrame(tick);
		};

		image.addEventListener('load', () => {
			if (disposed) return;
			layout();
			wake();
		});

		image.src = src;

		const visibility = new IntersectionObserver(
			([entry]) => {
				onScreen = entry.isIntersecting;
				if (onScreen) wake();
			},
			{ rootMargin: '200px 0px' }
		);
		visibility.observe(container);

		const resize = new ResizeObserver(() => {
			if (!image.complete || !image.naturalWidth) return;
			layout();
			wake();
		});
		resize.observe(container);

		return () => {
			disposed = true;
			visibility.disconnect();
			resize.disconnect();
			if (frame !== null) cancelAnimationFrame(frame);
		};
	}, [src]);

	return (
		<div ref={containerRef} className={className}>
			<canvas
				ref={canvasRef}
				role="img"
				aria-label={alt}
				style={{
					display: 'block',
					width: '100%',
					// The crop has no bottom edge: it runs out into the ground the way the
					// fall-off handles the sides, so the portrait is seated on the page
					// rather than framed on it.
					maskImage: 'linear-gradient(to bottom, #000 62%, transparent 100%)',
					WebkitMaskImage: 'linear-gradient(to bottom, #000 62%, transparent 100%)',
				}}
			/>
		</div>
	);
};

export default ContributionPortrait;
