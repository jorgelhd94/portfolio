import { useEffect, useRef } from 'react';

/**
 * Text built out of GitHub contribution cells: only the squares falling inside
 * the letterforms are drawn, so the words sit on the page with no grid or panel
 * behind them.
 *
 * On mount the words play back the story of the graph — empty grey, then green
 * arriving in scattered bursts, then a wave that collects every cell and hands
 * it to the final white. Afterwards the cursor pushes cells aside and brightens
 * them as it passes, and scrolling past takes the words apart again: each cell
 * lets go on its own bearing and at its own moment, so the words come apart
 * where they stand instead of being wiped off.
 *
 * Three constraints hold the type legible, and breaking any of them is what
 * makes it read as static instead of as letters: glyphs scale uniformly and are
 * never stretched to fit; levels come from smooth 2D noise so neighbours land
 * in the same band; and every step of the ramp already clears the background.
 */

/** Used only if the theme variable is missing; the real face is self-hosted. */
const FALLBACK_STACK = '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Canvas needs a concrete family list, and the theme's generated name is it. */
const resolveFontStack = () => {
	const value = getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim();
	return value || FALLBACK_STACK;
};

/**
 * Assigning a malformed shorthand to `ctx.font` is a no-op: canvas keeps the
 * previous value and reports nothing. The theme's family name is generated, so
 * verify it took rather than silently rasterising in 10px sans-serif.
 */
const applyFont = (context: CanvasRenderingContext2D, stack: string) => {
	const font = `900 ${BASE_FONT_SIZE}px ${stack}`;
	context.font = font;

	if (!context.font.includes(`${BASE_FONT_SIZE}px`)) {
		context.font = `900 ${BASE_FONT_SIZE}px ${FALLBACK_STACK}`;
	}

	return context.font;
};

/**
 * Dimmest to brightest. Narrow enough that every step still reads as white, wide
 * enough that the noise shows as texture and the pointer has somewhere to
 * brighten towards.
 */
const DEFAULT_PALETTE = ['#b9b9b9', '#d8d8d8', '#efefef', '#ffffff'];

/** GitHub's own scale, borrowed for the intro only. */
const EMPTY_COLOR = '#1c1b1a';
const GREEN_RAMP = ['#0e4429', '#006d32', '#26a641', '#39d353'];

/**
 * Share of cells that light up during the green phase. The gaps are what make it
 * read as activity: at 1 the words are a green block.
 */
const GREEN_DENSITY = 0.6;

const BASE_FONT_SIZE = 100;
const SUPERSAMPLE = 10;
const COVERAGE_THRESHOLD = 0.45;

/**
 * Cell pitch the grid aims for, and the floor on how few columns it will use.
 *
 * Lines are justified across the container, so width alone sets how big the
 * words are: the column count governs how finely they are *resolved*. Holding
 * 96 columns on a phone gives 3px cells, which read as fuzz rather than tiles,
 * and the floor is what stops the letterforms coarsening past readable.
 */
const TARGET_PITCH = 11;
const MIN_COLUMNS = 64;
/** Cells per noise period: how wide the brightness patches run. */
const NOISE_SCALE = 5.5;
/**
 * How the words come apart as the header is scrolled past. The spread is how
 * much of the travel is spent staggering; it has to stay under half, or the
 * first cells are gone before the last have started and a two-line headline
 * loses one word while the other is still whole.
 */
const DISSOLVE_SPREAD = 0.42;

/**
 * Room around the letters for cells to scatter into. The canvas is otherwise
 * exactly the size of the words, and drifting cells are clipped at its edge —
 * which leaves the scattered field ending in a perfect rectangle. Negative
 * margins keep the extra area out of the layout.
 */
const BLEED = 150;

/** Fallback range, as the container's top edge over the viewport height. */
const DISSOLVE_START = 0.05;
const DISSOLVE_END = -0.3;

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
const WHITE_GLOW: Rgb = [236, 234, 232];

type Rgb = [number, number, number];

interface ContributionTextProps {
	lines: string[];
	/** Hanging punctuation: sits past the justified block, not inside it. */
	trailingMark?: string;
	/** Upper bound on grid resolution. Narrow viewports resolve to fewer. */
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
	/** Whether this cell takes part in the green phase at all. */
	contributes: boolean;
	/** When this cell turns green (Infinity if it never does), and when it turns white. */
	fillAt: number;
	flipAt: number;
	/** Where this cell goes as the words come apart, and how long it waits first. */
	driftX: number;
	driftY: number;
	lift: number;
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
		/** Resolved from the container width; the `columns` prop is only a ceiling. */
		let activeColumns = columns;
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
		let dissolve = 0;

		const pointer = { x: 0, y: 0, active: false };

		/**
		 * Rasterise the text and mark which cells the letterforms cover. Row count
		 * falls out of the type rather than being imposed on it, which is what lets
		 * the glyphs keep their real proportions.
		 */
		const buildMask = () => {
			const probe = document.createElement('canvas').getContext('2d');
			if (!probe) return;

			const font = applyFont(probe, resolveFontStack());

			const maskWidth = activeColumns * SUPERSAMPLE;
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

			// The lines justify to `measure` and the mark takes the remainder, so it
			// overhangs the block. Folding it into a line would shrink that line.
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
			glyphMask = new Array<boolean>(activeColumns * rows).fill(false);

			const mask = document.createElement('canvas');
			mask.width = maskWidth;
			mask.height = rows * SUPERSAMPLE;

			const maskCtx = mask.getContext('2d', { willReadFrequently: true });
			if (!maskCtx) return;

			maskCtx.fillStyle = '#fff';
			maskCtx.textBaseline = 'alphabetic';
			maskCtx.font = font;

			let cursorY = 0;

			measured.forEach((item, index) => {
				if (item.height <= 0) return;

				maskCtx.save();
				maskCtx.translate(0, cursorY);
				maskCtx.scale(item.scale, item.scale);
				maskCtx.fillText(item.line, 0, item.ascent);

				// Drawn at the line's own advance width, so it keeps the font's spacing.
				if (trailingMark && index === measured.length - 1) {
					maskCtx.fillText(trailingMark, item.width, item.ascent);
				}

				maskCtx.restore();

				cursorY += item.height + gap;
			});

			const { data } = maskCtx.getImageData(0, 0, mask.width, mask.height);
			const perCell = SUPERSAMPLE * SUPERSAMPLE;

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < activeColumns; col++) {
					let covered = 0;

					for (let y = 0; y < SUPERSAMPLE; y++) {
						const pixelY = row * SUPERSAMPLE + y;
						for (let x = 0; x < SUPERSAMPLE; x++) {
							const pixelX = col * SUPERSAMPLE + x;
							if (data[(pixelY * mask.width + pixelX) * 4 + 3] > 127) covered++;
						}
					}

					glyphMask[row * activeColumns + col] = covered / perCell > COVERAGE_THRESHOLD;
				}
			}
		};

		const layout = () => {
			const width = container.clientWidth;
			if (!width || !rows) return;

			const pitch = width / activeColumns;
			// Close to GitHub's own ratio. Any tighter and the squares stop reading as
			// separate tiles and start reading as a solid mass.
			cellSize = pitch * 0.78;
			cornerRadius = Math.max(1, cellSize * 0.25);
			cssWidth = width + BLEED * 2;
			cssHeight = rows * pitch + BLEED * 2;

			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(cssWidth * dpr);
			canvas.height = Math.round(cssHeight * dpr);
			canvas.style.width = `${cssWidth}px`;
			canvas.style.height = `${cssHeight}px`;
			canvas.style.margin = `${-BLEED}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const inset = (pitch - cellSize) / 2;
			let cursor = 0;

			cells = [];

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < activeColumns; col++) {
					// Cells outside the letters are never created: no grid, no panel.
					if (!glyphMask[row * activeColumns + col]) continue;

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

					// Half the fill timing comes from the column and half is scattered per
					// cell, so green lands in bursts rather than as a wall moving right.
					// Both derive from grid position, so a resize mid-intro stays in step.
					const acrossFill = activeColumns > 1 ? col / (activeColumns - 1) : 0;
					const acrossFlip = acrossFill * 0.78 + (rows > 1 ? row / (rows - 1) : 0) * 0.22;

					const contributes = hash2(col + 31, row + 17) < GREEN_DENSITY;
					const scatter = hash2(col + 977, row + 613);

					const homeX = col * pitch + inset + BLEED;
					const homeY = row * pitch + inset + BLEED;

					// Every cell leaves on its own bearing and at its own moment. A shared
					// direction with an ordered front is a curtain however it is timed:
					// what makes this read as coming apart is that there is no front.
					const bearing = hash2(col + 401, row + 89) * Math.PI * 2;
					const reach = 26 + hash2(col + 137, row + 971) * 84;

					cells.push({
						homeX,
						homeY,
						x: homeX,
						y: homeY,
						vx: 0,
						vy: 0,
						level,
						contributes,
						fillAt: contributes
							? INTRO_DELAY + (acrossFill * 0.5 + scatter * 0.5) * FILL_SWEEP
							: Infinity,
						flipAt: FLIP_START + clamp01(acrossFlip) * FLIP_SWEEP,
						driftX: Math.cos(bearing) * reach,
						driftY: Math.sin(bearing) * reach,
						lift: hash2(col + 53, row + 29),
					});
				}
			}
		};

		/**
		 * How far the words have come apart: 0 in place, 1 gone.
		 *
		 * Whoever owns the scroll can declare `--dissolve` on an ancestor and drive
		 * this directly. Pinned, the canvas never moves, so its own position on
		 * screen says nothing about how far the reader has come — the fallback below
		 * only holds where the words scroll normally.
		 */
		const dissolveAt = () => {
			if (prefersReducedMotion) return 0;

			const declared = getComputedStyle(container).getPropertyValue('--dissolve');
			if (declared) return clamp01(parseFloat(declared));

			const rect = container.getBoundingClientRect();
			const viewport = window.innerHeight || 1;
			const start = viewport * DISSOLVE_START;
			const end = viewport * DISSOLVE_END;

			return clamp01((start - rect.top) / (start - end));
		};

		const draw = (elapsed: number) => {
			ctx.clearRect(0, 0, cssWidth, cssHeight);

			const settled = elapsed >= INTRO_END;

			for (const cell of cells) {
				let level = cell.level;
				let size = cellSize;
				let offsetX = 0;
				let offsetY = 0;
				let alpha = 1;

				if (dissolve > 0) {
					const gone = easeOutCubic(
						clamp01((dissolve - cell.lift * DISSOLVE_SPREAD) / (1 - DISSOLVE_SPREAD))
					);

					if (gone >= 1) continue;

					offsetX = cell.driftX * gone;
					offsetY = cell.driftY * gone;
					alpha = 1 - gone;
					size *= 1 - gone * 0.45;
				}

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

				// Ordered so the handoff wins over the fill: cells that never went green
				// carry fillAt = Infinity, and the wave still has to collect them.
				if (settled) {
					fill = palette[level] ?? palette[0];
				} else if (elapsed >= cell.flipAt) {
					const progress = clamp01((elapsed - cell.flipAt) / CELL_FLIP);
					// A crest of pure white rides the front of the wave, so the handoff
					// reads as light passing through rather than a plain colour change.
					const crest = Math.sin(progress * Math.PI);
					const from = cell.contributes ? (greenRgb[level] ?? greenRgb[0]) : emptyRgb;
					const base = mix(from, whiteRgb[level] ?? whiteRgb[0], easeOutCubic(progress));

					fill = css(mix(base, pureWhite, crest * 0.55));
					size *= 1 + crest * 0.3;
				} else if (elapsed >= cell.fillAt) {
					const progress = clamp01((elapsed - cell.fillAt) / CELL_FILL);
					fill = css(mix(emptyRgb, greenRgb[level] ?? greenRgb[0], easeOutCubic(progress)));
					size *= 1 + 0.18 * Math.sin(progress * Math.PI);
				} else {
					fill = EMPTY_COLOR;
				}

				ctx.fillStyle = fill;
				ctx.globalAlpha = alpha;

				const x = cell.x + offsetX;
				const y = cell.y + offsetY;

				if (hasRoundRect) {
					ctx.beginPath();
					ctx.roundRect(x, y, size, size, cornerRadius);
					ctx.fill();
				} else {
					ctx.fillRect(x, y, size, size);
				}
			}

			ctx.globalAlpha = 1;
		};

		/** The spill follows the cells: absent while empty, green, then white. */
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

		// Stops once the intro is over, the springs settle and the words are either
		// fully in place or fully gone: an idle hero costs nothing.
		const tick = (now: number) => {
			if (introStart === null) introStart = now;

			const elapsed = prefersReducedMotion ? Infinity : now - introStart;
			const moving = step();

			dissolve = dissolveAt();
			updateGlow(elapsed);
			draw(elapsed);

			frame =
				pointer.active || moving || elapsed < INTRO_END || (dissolve > 0 && dissolve < 1)
					? requestAnimationFrame(tick)
					: null;
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

		/** Columns that put the cells nearest the target pitch, within the bounds. */
		const pickColumns = () =>
			Math.min(
				columns,
				Math.max(MIN_COLUMNS, Math.round((container.clientWidth || 1) / TARGET_PITCH))
			);

		const rebuild = () => {
			activeColumns = pickColumns();
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
			// The loop parks itself once the words are gone, so scrolling has to be
			// what starts it again — including on the way back up.
			window.addEventListener('scroll', wake, { passive: true });
		}

		const observer = new ResizeObserver(() => {
			// A width change that lands on a different column count needs the mask
			// rasterised again; anything else only needs the cells repositioned.
			if (pickColumns() !== activeColumns) {
				rebuild();
				return;
			}

			layout();
			wake();
		});
		observer.observe(container);

		return () => {
			disposed = true;
			observer.disconnect();
			canvas.removeEventListener('pointermove', handlePointerMove);
			canvas.removeEventListener('pointerleave', handlePointerLeave);
			window.removeEventListener('scroll', wake);
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
					maxWidth: 'none',
					// One composite for the whole canvas; per-cell shadowBlur would cost a
					// blurred fill each. Neutral rather than tinted towards the rays: a warm
					// spill creeps into the edges of the one element that stays white.
					filter: RESTING_FILTER,
				}}
			/>
		</div>
	);
};

export default ContributionText;
