import { useEffect, useRef } from 'react';

/**
 * Text built out of GitHub contribution cells: only the squares that fall inside
 * the letterforms are drawn, so the words sit straight on the page with no grid
 * or panel behind them.
 *
 * Legibility drives the three decisions that matter here:
 *
 *   - Glyphs are scaled uniformly, never stretched to fit the box. Distorted
 *     letterforms are the fastest way to make display type unreadable.
 *   - Levels come from smooth 2D noise, not per-cell randomness. Neighbours end
 *     up in the same band, so brightness moves in patches the eye reads as one
 *     shape, instead of the television static you get from independent samples.
 *   - Every step of the ramp already clears the graphite behind it. A level
 *     nobody can see is a hole punched in the middle of a stroke.
 *
 * On mount the words play back the story of the graph: they start in GitHub's
 * empty-cell grey, fill with green column by column the way a year of commits
 * lands, then a wave sweeps across and hands them over to the final white.
 *
 * Pointer interaction: cells are pushed away from the cursor and spring back,
 * and they brighten as it passes, as if the cursor left activity behind it.
 */

const FONT_STACK = '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif';

/**
 * A tight white ramp, dimmest to brightest. Kept narrow on purpose: wide enough
 * that the noise still shows as texture and the pointer has somewhere to
 * brighten towards, narrow enough that every cell reads as white.
 */
const DEFAULT_PALETTE = ['#b3bccf', '#d5dced', '#e8ecf5', '#ffffff'];

/** GitHub's own scale, borrowed for the intro only. */
const EMPTY_COLOR = '#1b2027';
const GREEN_RAMP = ['#0e4429', '#006d32', '#26a641', '#39d353'];

const BASE_FONT_SIZE = 100;
const SUPERSAMPLE = 10;
const COVERAGE_THRESHOLD = 0.45;
/** Cells per noise period: how wide the brightness patches run. */
const NOISE_SCALE = 5.5;
const REPEL_RADIUS = 92;
const REPEL_STRENGTH = 2.4;
const SPRING = 0.055;
const DAMPING = 0.86;
const REST_THRESHOLD = 0.05;

// Intro timeline, in ms.
const INTRO_DELAY = 400;
/** How long the green takes to cross the words. */
const FILL_SWEEP = 1200;
/** How long a single cell takes to go from empty to green. */
const CELL_FILL = 280;
const INTRO_HOLD = 300;
/** How long the handoff wave takes to cross. */
const FLIP_SWEEP = 800;
/** How long a single cell takes to go from green to white. */
const CELL_FLIP = 420;
const FLIP_START = INTRO_DELAY + FILL_SWEEP + CELL_FILL + INTRO_HOLD;
const INTRO_END = FLIP_START + FLIP_SWEEP + CELL_FLIP;

const GREEN_GLOW: Rgb = [57, 211, 83];
const WHITE_GLOW: Rgb = [150, 190, 255];

type Rgb = [number, number, number];

interface ContributionTextProps {
	lines: string[];
	/** Hanging punctuation: sits past the justified block, not inside it. */
	trailingMark?: string;
	/** Grid resolution across the width. Higher means finer letterforms. */
	columns?: number;
	/** Blank rows between lines. */
	lineGap?: number;
	/** Real contribution levels, consumed in reading order. Noise when omitted. */
	levels?: number[];
	palette?: string[];
	className?: string;
}

interface Cell {
	homeX: number;
	homeY: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	level: number;
	/** When this cell turns green, and when it hands over to white. */
	fillAt: number;
	flipAt: number;
}

const toRgb = (hex: string): Rgb => {
	const value = hex.replace('#', '');
	const full =
		value.length === 3
			? value
					.split('')
					.map((char) => char + char)
					.join('')
			: value;
	const int = parseInt(full, 16);

	return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
	a[0] + (b[0] - a[0]) * t,
	a[1] + (b[1] - a[1]) * t,
	a[2] + (b[2] - a[2]) * t,
];

const css = (color: Rgb) => `rgb(${color[0] | 0},${color[1] | 0},${color[2] | 0})`;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const hash2 = (x: number, y: number) => {
	let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Value noise: deterministic, and neighbouring cells land close together. */
const valueNoise = (x: number, y: number) => {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const fx = smoothstep(x - xi);
	const fy = smoothstep(y - yi);

	const top = hash2(xi, yi) * (1 - fx) + hash2(xi + 1, yi) * fx;
	const bottom = hash2(xi, yi + 1) * (1 - fx) + hash2(xi + 1, yi + 1) * fx;

	return top * (1 - fy) + bottom * fy;
};

const glowFilter = (color: Rgb, alpha: number) =>
	`drop-shadow(0 0 9px rgba(${color[0] | 0}, ${color[1] | 0}, ${color[2] | 0}, ${alpha.toFixed(3)}))`;

const RESTING_FILTER = glowFilter(WHITE_GLOW, 0.18);

const ContributionText = ({
	lines,
	trailingMark,
	columns = 96,
	lineGap = 3,
	levels,
	palette = DEFAULT_PALETTE,
	className = '',
}: ContributionTextProps) => {
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
		const topLevel = palette.length - 1;

		const emptyRgb = toRgb(EMPTY_COLOR);
		const greenRgb = GREEN_RAMP.map(toRgb);
		const whiteRgb = palette.map(toRgb);
		const pureWhite: Rgb = [255, 255, 255];

		let disposed = false;
		let rows = 0;
		let glyphMask: boolean[] = [];
		let cells: Cell[] = [];
		let cellSize = 0;
		let cornerRadius = 0;
		let cssWidth = 0;
		let cssHeight = 0;
		let frame: number | null = null;
		let introStart: number | null = null;
		let filterOverridden = false;

		const pointer = { x: 0, y: 0, active: false };

		/**
		 * Rasterise the text and mark which cells the letterforms cover. Row count
		 * falls out of the type rather than being imposed on it, which is what lets
		 * the glyphs keep their real proportions.
		 */
		const buildMask = () => {
			const probe = document.createElement('canvas').getContext('2d');
			if (!probe) return;

			probe.font = `900 ${BASE_FONT_SIZE}px ${FONT_STACK}`;

			const maskWidth = columns * SUPERSAMPLE;
			const gap = lineGap * SUPERSAMPLE;

			const raw = lines.map((line) => {
				const metrics = probe.measureText(line);

				return {
					line,
					width: metrics.width || 1,
					ascent: metrics.actualBoundingBoxAscent,
					descent: metrics.actualBoundingBoxDescent,
				};
			});

			// Hanging punctuation: the lines justify to `measure` and the mark takes the
			// remainder, so the words keep the alignment they had and the mark overhangs
			// them. Folding it into a line instead would shrink that line's letters.
			const markWidth = trailingMark ? probe.measureText(trailingMark).width : 0;
			const lastWidth = raw[raw.length - 1]?.width ?? 1;
			const measure = markWidth > 0 ? maskWidth / (1 + markWidth / lastWidth) : maskWidth;

			const measured = raw.map((item) => {
				const scale = measure / item.width;

				return {
					...item,
					scale,
					height: (item.ascent + item.descent) * scale,
				};
			});

			const textHeight = measured.reduce((total, item) => total + item.height, 0);
			const maskHeight = Math.ceil(textHeight + gap * Math.max(0, lines.length - 1));

			rows = Math.max(1, Math.ceil(maskHeight / SUPERSAMPLE));
			glyphMask = new Array<boolean>(columns * rows).fill(false);

			const mask = document.createElement('canvas');
			mask.width = maskWidth;
			mask.height = rows * SUPERSAMPLE;

			const maskCtx = mask.getContext('2d', { willReadFrequently: true });
			if (!maskCtx) return;

			maskCtx.fillStyle = '#fff';
			maskCtx.textBaseline = 'alphabetic';
			maskCtx.font = `900 ${BASE_FONT_SIZE}px ${FONT_STACK}`;

			let cursorY = 0;

			measured.forEach((item, index) => {
				if (item.height <= 0) return;

				maskCtx.save();
				maskCtx.translate(0, cursorY);
				maskCtx.scale(item.scale, item.scale);
				maskCtx.fillText(item.line, 0, item.ascent);

				// Drawn at the line's own advance width, so it keeps the spacing the font
				// would give it, and lands beyond the justified block by construction.
				if (trailingMark && index === measured.length - 1) {
					maskCtx.fillText(trailingMark, item.width, item.ascent);
				}

				maskCtx.restore();

				cursorY += item.height + gap;
			});

			const { data } = maskCtx.getImageData(0, 0, mask.width, mask.height);
			const perCell = SUPERSAMPLE * SUPERSAMPLE;

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < columns; col++) {
					let covered = 0;

					for (let y = 0; y < SUPERSAMPLE; y++) {
						const pixelY = row * SUPERSAMPLE + y;
						for (let x = 0; x < SUPERSAMPLE; x++) {
							const pixelX = col * SUPERSAMPLE + x;
							if (data[(pixelY * mask.width + pixelX) * 4 + 3] > 127) covered++;
						}
					}

					glyphMask[row * columns + col] = covered / perCell > COVERAGE_THRESHOLD;
				}
			}
		};

		const layout = () => {
			const width = container.clientWidth;
			if (!width || !rows) return;

			const pitch = width / columns;
			cellSize = pitch * 0.84;
			cornerRadius = Math.max(1, cellSize * 0.24);
			cssWidth = width;
			cssHeight = rows * pitch;

			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(cssWidth * dpr);
			canvas.height = Math.round(cssHeight * dpr);
			canvas.style.width = `${cssWidth}px`;
			canvas.style.height = `${cssHeight}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const inset = (pitch - cellSize) / 2;
			let cursor = 0;

			cells = [];

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < columns; col++) {
					// Cells outside the letters are never created: no grid, no panel.
					if (!glyphMask[row * columns + col]) continue;

					let level: number;

					if (levels && levels.length > 0) {
						level = Math.min(topLevel, Math.max(0, levels[cursor % levels.length]));
						cursor++;
					} else {
						// Thresholds sit low because value noise clusters around its midpoint;
						// this leaves most cells in the top two bands.
						const sample = valueNoise(col / NOISE_SCALE, row / NOISE_SCALE);
						level = sample < 0.26 ? 0 : sample < 0.4 ? 1 : sample < 0.55 ? 2 : 3;
					}

					// Green arrives column by column, like weeks on the real graph. The
					// handoff wave leans diagonal so it doesn't repeat the same motion.
					// Both are derived from the grid, so a resize mid-intro stays in step.
					const acrossFill = columns > 1 ? col / (columns - 1) : 0;
					const acrossFlip =
						acrossFill * 0.78 + (rows > 1 ? row / (rows - 1) : 0) * 0.22;

					const homeX = col * pitch + inset;
					const homeY = row * pitch + inset;

					cells.push({
						homeX,
						homeY,
						x: homeX,
						y: homeY,
						vx: 0,
						vy: 0,
						level,
						fillAt: INTRO_DELAY + acrossFill * FILL_SWEEP + hash2(col + 977, row + 613) * 180,
						flipAt: FLIP_START + clamp01(acrossFlip) * FLIP_SWEEP,
					});
				}
			}
		};

		const draw = (elapsed: number) => {
			ctx.clearRect(0, 0, cssWidth, cssHeight);

			const settled = elapsed >= INTRO_END;

			for (const cell of cells) {
				let level = cell.level;
				let size = cellSize;

				if (pointer.active) {
					const dx = cell.x + cellSize / 2 - pointer.x;
					const dy = cell.y + cellSize / 2 - pointer.y;
					const distance = Math.hypot(dx, dy);

					if (distance < REPEL_RADIUS) {
						const boost = 1 - distance / REPEL_RADIUS;
						level = Math.min(topLevel, level + Math.round(boost * 2.4));
						size = cellSize * (1 + boost * 0.25);
					}
				}

				let fill: string;

				if (settled) {
					fill = palette[level] ?? palette[0];
				} else if (elapsed < cell.fillAt) {
					fill = EMPTY_COLOR;
				} else if (elapsed < cell.flipAt) {
					const progress = clamp01((elapsed - cell.fillAt) / CELL_FILL);
					fill = css(mix(emptyRgb, greenRgb[level] ?? greenRgb[0], easeOutCubic(progress)));
					size *= 1 + 0.18 * Math.sin(progress * Math.PI);
				} else {
					const progress = clamp01((elapsed - cell.flipAt) / CELL_FLIP);
					// A crest of pure white rides the front of the wave, so the handoff
					// reads as light passing through rather than a plain colour change.
					const crest = Math.sin(progress * Math.PI);
					const base = mix(
						greenRgb[level] ?? greenRgb[0],
						whiteRgb[level] ?? whiteRgb[0],
						easeOutCubic(progress)
					);
					fill = css(mix(base, pureWhite, crest * 0.55));
					size *= 1 + crest * 0.3;
				}

				ctx.fillStyle = fill;

				if (hasRoundRect) {
					ctx.beginPath();
					ctx.roundRect(cell.x, cell.y, size, size, cornerRadius);
					ctx.fill();
				} else {
					ctx.fillRect(cell.x, cell.y, size, size);
				}
			}
		};

		/** The spill follows the cells: absent while empty, green, then blue. */
		const updateGlow = (elapsed: number) => {
			if (elapsed >= INTRO_END) {
				if (filterOverridden) {
					canvas.style.filter = RESTING_FILTER;
					filterOverridden = false;
				}
				return;
			}

			const filled = clamp01((elapsed - INTRO_DELAY) / (FILL_SWEEP + CELL_FILL));
			const flipped = clamp01((elapsed - FLIP_START) / (FLIP_SWEEP + CELL_FLIP));
			const alpha = 0.22 * filled * (1 - flipped) + 0.18 * flipped;

			canvas.style.filter = glowFilter(mix(GREEN_GLOW, WHITE_GLOW, flipped), alpha);
			filterOverridden = true;
		};

		/** Advance the springs. Returns whether anything is still in motion. */
		const step = () => {
			let moving = false;

			for (const cell of cells) {
				if (pointer.active) {
					const dx = cell.x + cellSize / 2 - pointer.x;
					const dy = cell.y + cellSize / 2 - pointer.y;
					const distance = Math.hypot(dx, dy) || 1;

					if (distance < REPEL_RADIUS) {
						const force = (1 - distance / REPEL_RADIUS) * REPEL_STRENGTH;
						cell.vx += (dx / distance) * force;
						cell.vy += (dy / distance) * force;
					}
				}

				cell.vx += (cell.homeX - cell.x) * SPRING;
				cell.vy += (cell.homeY - cell.y) * SPRING;
				cell.vx *= DAMPING;
				cell.vy *= DAMPING;
				cell.x += cell.vx;
				cell.y += cell.vy;

				if (
					Math.abs(cell.x - cell.homeX) > REST_THRESHOLD ||
					Math.abs(cell.y - cell.homeY) > REST_THRESHOLD
				) {
					moving = true;
				}
			}

			return moving;
		};

		// The loop stops once the intro is over and the grid settles, so an idle hero
		// costs nothing.
		const tick = (now: number) => {
			if (introStart === null) introStart = now;

			const elapsed = prefersReducedMotion ? Infinity : now - introStart;
			const moving = step();

			updateGlow(elapsed);
			draw(elapsed);

			frame =
				pointer.active || moving || elapsed < INTRO_END ? requestAnimationFrame(tick) : null;
		};

		const wake = () => {
			if (frame === null) frame = requestAnimationFrame(tick);
		};

		const handlePointerMove = (event: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			pointer.x = event.clientX - rect.left;
			pointer.y = event.clientY - rect.top;
			pointer.active = true;
			wake();
		};

		const handlePointerLeave = () => {
			pointer.active = false;
			wake();
		};

		const rebuild = () => {
			buildMask();
			layout();
			wake();
		};

		rebuild();

		// Rebuild once webfonts settle, otherwise the mask keeps the fallback shapes.
		document.fonts?.ready.then(() => {
			if (!disposed) rebuild();
		});

		if (!prefersReducedMotion) {
			canvas.addEventListener('pointermove', handlePointerMove);
			canvas.addEventListener('pointerleave', handlePointerLeave);
		}

		const observer = new ResizeObserver(() => {
			layout();
			wake();
		});
		observer.observe(container);

		return () => {
			disposed = true;
			observer.disconnect();
			canvas.removeEventListener('pointermove', handlePointerMove);
			canvas.removeEventListener('pointerleave', handlePointerLeave);
			if (frame !== null) cancelAnimationFrame(frame);
		};
	}, [lines, trailingMark, columns, lineGap, levels, palette]);

	return (
		<div ref={containerRef} className={className}>
			<canvas
				ref={canvasRef}
				style={{
					display: 'block',
					width: '100%',
					// One GPU filter for the whole canvas, kept tight: enough spill to seat the
					// words on the graphite, not enough to soften their edges. The spill is
					// tinted towards the blue of the rays behind it rather than neutral, so
					// the words pick up the light of the backdrop instead of ignoring it.
					// Per-cell shadowBlur would cost a blurred fill each; this is one composite.
					filter: RESTING_FILTER,
				}}
			/>
		</div>
	);
};

export default ContributionText;
