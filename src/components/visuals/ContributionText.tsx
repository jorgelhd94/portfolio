import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createContributionText, RESTING_FILTER, type ContributionTextOptions } from './contribution-text/renderer';

export default function ContributionText({ lines, trailingMark, columns, lineGap, palette, className = '' }: ContributionTextOptions) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const reducedMotion = useReducedMotion();

	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;
		return createContributionText(container, canvas, { lines, trailingMark, columns, lineGap, palette }, reducedMotion);
	}, [lines, trailingMark, columns, lineGap, palette, reducedMotion]);

	return (
		<div ref={containerRef} className={className}>
			<canvas ref={canvasRef} aria-hidden="true" style={{
				display: 'block', width: '100%', maxWidth: 'none',
				pointerEvents: 'none', filter: RESTING_FILTER,
			}} />
		</div>
	);
}
