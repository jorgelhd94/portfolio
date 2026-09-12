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


const BASE_FONT_SIZE = 100;
const SUPERSAMPLE = 10;
const COVERAGE_THRESHOLD = 0.45;

export function createGlyphMask(lines: string[], columns: number, lineGap: number, trailingMark?: string) {
	const probe = document.createElement('canvas').getContext('2d');
	if (!probe) return;

	const font = applyFont(probe, resolveFontStack());

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

	const rows = Math.max(1, Math.ceil(maskHeight / SUPERSAMPLE));
	const glyphMask = new Array<boolean>(columns * rows).fill(false);

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
	return { rows, glyphMask };
}
