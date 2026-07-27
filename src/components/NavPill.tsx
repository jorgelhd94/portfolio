import { type MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Pill navigation lit from a source above the current item.
 *
 * It arrives as a greeting and then widens into the navigation. The pill's width
 * is driven from measured numbers for that stretch and handed back to the
 * content once the transition ends, so nothing stays frozen at a stale size when
 * a webfont lands or the labels change.
 *
 * The light is three layers, because that is how light actually falls off: a
 * 1px near-white core on the bar's edge, a tight bloom rising off it, and a
 * wide, very faint haze. A single blurred colour — the usual way this effect is
 * done — reads as a smudge pasted over the design instead of a lamp behind it.
 * None of the layers use `filter: blur`; gradients are already smooth, and
 * blurring one turns it to mush.
 *
 * The selected pill is lit to match: a hairline along its top edge where the
 * light lands, a warm tint bled into the top of its gradient, and a shadow cast
 * below. No ring around it — a full border on something this small reads as an
 * outlined chip sitting flat on the bar.
 *
 * Everything is one page, so the links drive a scroll spy. Sections that do not
 * exist yet are simply not observed, and clicking one still moves the indicator
 * without stranding a dead hash in the address bar.
 */

interface NavLink {
	label: string;
	href: string;
}

interface NavPillProps {
	links: NavLink[];
	greeting?: string;
}

interface Indicator {
	x: number;
	width: number;
}

/** Only the section crossing this band of the viewport counts as current. */
const SPY_MARGIN = '-45% 0px -50% 0px';

/** After a click, ignore the spy while the smooth scroll travels past sections. */
const SPY_LOCK = 800;

/** How long the greeting holds before the bar opens. */
const GREETING_HOLD = 1600;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const NavPill = ({ links, greeting = 'Welcome' }: NavPillProps) => {
	const [active, setActive] = useState(0);
	const [preview, setPreview] = useState<number | null>(null);
	const [indicator, setIndicator] = useState<Indicator>({ x: 0, width: 0 });
	const [widths, setWidths] = useState<{ greeting: number; full: number } | null>(null);
	const [expanded, setExpanded] = useState(false);
	/** Null once the transition is over, handing sizing back to the content. */
	const [pinnedWidth, setPinnedWidth] = useState<number | null>(null);

	const clipRef = useRef<HTMLDivElement | null>(null);
	const listRef = useRef<HTMLUListElement | null>(null);
	const greetingRef = useRef<HTMLSpanElement | null>(null);
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const spyLockedUntil = useRef(0);

	const target = preview ?? active;
	const measured = widths !== null;

	// Layout effect: measuring after paint would show the bar at the wrong size
	// for a frame, and it is painted before hydration runs.
	useLayoutEffect(() => {
		const list = listRef.current;
		const greetingEl = greetingRef.current;
		if (!list || !greetingEl) return;

		const next = { greeting: greetingEl.offsetWidth, full: list.offsetWidth };
		setWidths(next);

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setExpanded(true);
			return;
		}

		setPinnedWidth(next.greeting);

		const timer = window.setTimeout(() => {
			setExpanded(true);
			setPinnedWidth(next.full);
		}, GREETING_HOLD);

		return () => window.clearTimeout(timer);
	}, [links, greeting]);

	useLayoutEffect(() => {
		const measure = () => {
			const clip = clipRef.current;
			const item = itemRefs.current[target];
			if (!clip || !item) return;

			// Measured against the clip's own box rather than via offsetLeft, which
			// resolves against the nearest positioned ancestor and would silently
			// zero out if any wrapper in between gained `position: relative`.
			const clipRect = clip.getBoundingClientRect();
			const itemRect = item.getBoundingClientRect();

			setIndicator({ x: itemRect.left - clipRect.left, width: itemRect.width });
		};

		measure();

		const list = listRef.current;
		if (!list) return;

		const observer = new ResizeObserver(measure);
		observer.observe(list);

		// Labels reflow when a webfont lands, which moves every item under it.
		document.fonts?.ready.then(measure);

		return () => observer.disconnect();
	}, [target, links]);

	useEffect(() => {
		const indexByElement = new Map<Element, number>();

		links.forEach((link, index) => {
			const element = document.getElementById(link.href.replace('#', ''));
			if (element) indexByElement.set(element, index);
		});

		if (indexByElement.size === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (performance.now() < spyLockedUntil.current) return;

				for (const entry of entries) {
					if (!entry.isIntersecting) continue;

					const index = indexByElement.get(entry.target);
					if (index !== undefined) setActive(index);
				}
			},
			{ rootMargin: SPY_MARGIN }
		);

		for (const element of indexByElement.keys()) observer.observe(element);

		return () => observer.disconnect();
	}, [links]);

	const handleClick = (event: MouseEvent<HTMLAnchorElement>, index: number, href: string) => {
		setActive(index);
		setPreview(null);
		spyLockedUntil.current = performance.now() + SPY_LOCK;

		// The section is not built yet: keep the nav responsive, but don't navigate
		// to an anchor that goes nowhere.
		if (!document.getElementById(href.replace('#', ''))) event.preventDefault();
	};

	const lit = preview !== null;

	const rail = {
		transform: `translateX(${indicator.x}px)`,
		width: `${indicator.width}px`,
		opacity: expanded ? 1 : 0,
		transitionProperty: measured ? 'transform, width, opacity' : 'none',
		transitionDuration: '480ms',
		transitionTimingFunction: EASE,
		transitionDelay: expanded ? '220ms, 220ms, 260ms' : '0ms',
	};

	return (
		<div
			className="relative hidden lg:block"
			style={{
				// Hidden until the first measurement: the server cannot know either
				// width, so the alternative is a frame of full-width greeting.
				opacity: measured ? 1 : 0,
				width: pinnedWidth === null ? undefined : `${pinnedWidth}px`,
				transition: `width 620ms ${EASE}, opacity 200ms linear`,
			}}
			onTransitionEnd={(event) => {
				if (event.propertyName === 'width' && expanded) setPinnedWidth(null);
			}}
		>
			<div
				ref={clipRef}
				onPointerLeave={() => setPreview(null)}
				onBlur={(event) => {
					if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPreview(null);
				}}
				className="relative overflow-hidden rounded-full border border-white/[0.06] bg-ink-950/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl"
			>
				<span
					aria-hidden="true"
					style={{
						...rail,
						background:
							'linear-gradient(180deg, rgba(255, 214, 178, 0.11), rgba(255, 255, 255, 0.035))',
						boxShadow:
							'inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 8px 22px -14px rgba(237, 170, 122, 0.7), 0 3px 10px -6px rgba(0, 0, 0, 0.7)',
					}}
					className="pointer-events-none absolute inset-y-1.5 left-0 rounded-full"
				/>

				<ul
					ref={listRef}
					style={{
						opacity: expanded ? 1 : 0,
						transition: `opacity 420ms linear ${expanded ? '200ms' : '0ms'}`,
					}}
					className="flex w-max items-center p-1.5"
				>
					{links.map((link, index) => (
						<li key={link.href}>
							<a
								ref={(node) => {
									itemRefs.current[index] = node;
								}}
								href={link.href}
								tabIndex={expanded ? undefined : -1}
								aria-current={index === active ? 'page' : undefined}
								onPointerEnter={() => setPreview(index)}
								onFocus={() => setPreview(index)}
								onClick={(event) => handleClick(event, index, link.href)}
								className={`block rounded-full px-5 py-2 text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-400 ${
									index === target ? 'text-white' : 'text-mist-300 hover:text-mist-100'
								}`}
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>

				<span
					aria-hidden="true"
					style={{
						opacity: expanded ? 0 : 1,
						transition: `opacity 260ms linear`,
					}}
					className="pointer-events-none absolute inset-0 flex items-center justify-center"
				>
					<span
						ref={greetingRef}
						className="flex w-max items-center gap-2 px-7 py-2 text-sm font-medium whitespace-nowrap text-mist-100"
					>
						{/* Its own element so the rotation is the hand's alone: animating the
						    whole greeting would swing the word with it. Pivot at the lower
						    right, which is where a wrist is. */}
						<span className="inline-block origin-[70%_80%] animate-wave motion-reduce:animate-none">
							👋
						</span>
						{greeting}
					</span>
				</span>
			</div>

			{/* Zero-height rail pinned to the top edge, outside the clip so every
			    layer hangs above the bar without being cut off by it. */}
			<span aria-hidden="true" style={rail} className="pointer-events-none absolute top-0 left-0 h-0">
				<span
					className="absolute right-[-22%] bottom-0 left-[-22%] h-14 transition-opacity duration-500"
					style={{
						background:
							'radial-gradient(50% 100% at 50% 100%, rgba(237, 170, 122, 0.1), transparent 70%)',
						opacity: lit ? 1 : 0.65,
					}}
				/>
				<span
					className="absolute right-[-4%] bottom-0 left-[-4%] h-6 transition-opacity duration-500"
					style={{
						background:
							'radial-gradient(46% 100% at 50% 100%, rgba(240, 186, 142, 0.5), rgba(240, 186, 142, 0.13) 42%, transparent 72%)',
						opacity: lit ? 1 : 0.7,
					}}
				/>
				<span
					className="absolute -top-px right-[26%] left-[26%] h-px transition-opacity duration-500"
					style={{
						background:
							'linear-gradient(90deg, transparent, rgba(255, 240, 226, 0.95), transparent)',
						opacity: lit ? 1 : 0.7,
					}}
				/>
			</span>
		</div>
	);
};

export default NavPill;
