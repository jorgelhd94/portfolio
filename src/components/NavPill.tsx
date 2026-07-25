import { type MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Pill navigation lit from a source above the current item.
 *
 * The light is three layers, because that is how light actually falls off: a
 * 1px near-white core on the bar's edge, a tight bloom rising off it, and a
 * wide, very faint haze. A single blurred colour — the usual way this effect is
 * done — reads as a smudge pasted over the design instead of a lamp behind it.
 * None of the layers use `filter: blur`; gradients are already smooth, and
 * blurring one turns it to mush.
 *
 * The selected pill is lit to match: a hairline along its top edge where the
 * light lands, a cool tint bled into the top of its gradient, and a shadow cast
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
}

interface Indicator {
	x: number;
	width: number;
}

/** Only the section crossing this band of the viewport counts as current. */
const SPY_MARGIN = '-45% 0px -50% 0px';

/** After a click, ignore the spy while the smooth scroll travels past sections. */
const SPY_LOCK = 800;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const NavPill = ({ links }: NavPillProps) => {
	const [active, setActive] = useState(0);
	const [preview, setPreview] = useState<number | null>(null);
	const [indicator, setIndicator] = useState<Indicator>({ x: 0, width: 0 });
	const [ready, setReady] = useState(false);

	const listRef = useRef<HTMLUListElement | null>(null);
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const spyLockedUntil = useRef(0);

	const target = preview ?? active;

	// Layout effect: measuring after paint would show the indicator in the wrong
	// place for a frame.
	useLayoutEffect(() => {
		const measure = () => {
			const list = listRef.current;
			const item = itemRefs.current[target];
			if (!list || !item) return;

			// Measured against the list's own box rather than via offsetLeft, which
			// silently resolves against the nearest positioned ancestor: adding
			// `relative` to any wrapper in between would zero it out. `clientLeft` is
			// the border width, converting the rect's border-box origin to the
			// padding-box origin that `left: 0` uses on an absolute child.
			const listRect = list.getBoundingClientRect();
			const itemRect = item.getBoundingClientRect();

			setIndicator({
				x: itemRect.left - listRect.left - list.clientLeft,
				width: itemRect.width,
			});
			setReady(true);
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
		opacity: ready ? 1 : 0,
		transitionProperty: ready ? 'transform, width, opacity' : 'none',
		transitionDuration: '480ms',
		transitionTimingFunction: EASE,
	};

	return (
		<ul
			ref={listRef}
			onPointerLeave={() => setPreview(null)}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPreview(null);
			}}
			className="relative hidden items-center rounded-full border border-white/[0.06] bg-ink-950/40 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl md:flex"
		>
			<span
				aria-hidden="true"
				style={{
					...rail,
					background:
						'linear-gradient(180deg, rgba(178, 208, 255, 0.11), rgba(255, 255, 255, 0.035))',
					boxShadow:
						'inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 8px 22px -14px rgba(106, 169, 255, 0.7), 0 3px 10px -6px rgba(0, 0, 0, 0.7)',
				}}
				className="pointer-events-none absolute inset-y-1.5 left-0 rounded-full"
			/>

			{/* Zero-height rail pinned to the top edge, so every layer hangs above the
			    bar without adding to its box. */}
			<span aria-hidden="true" style={rail} className="pointer-events-none absolute top-0 left-0 h-0">
				<span
					className="absolute right-[-22%] bottom-0 left-[-22%] h-14 transition-opacity duration-500"
					style={{
						background:
							'radial-gradient(50% 100% at 50% 100%, rgba(106, 169, 255, 0.1), transparent 70%)',
						opacity: lit ? 1 : 0.65,
					}}
				/>
				<span
					className="absolute right-[-4%] bottom-0 left-[-4%] h-6 transition-opacity duration-500"
					style={{
						background:
							'radial-gradient(46% 100% at 50% 100%, rgba(126, 182, 255, 0.5), rgba(126, 182, 255, 0.13) 42%, transparent 72%)',
						opacity: lit ? 1 : 0.7,
					}}
				/>
				<span
					className="absolute -top-px right-[26%] left-[26%] h-px transition-opacity duration-500"
					style={{
						background:
							'linear-gradient(90deg, transparent, rgba(226, 238, 255, 0.95), transparent)',
						opacity: lit ? 1 : 0.7,
					}}
				/>
			</span>

			{links.map((link, index) => (
				<li key={link.href}>
					<a
						ref={(node) => {
							itemRefs.current[index] = node;
						}}
						href={link.href}
						aria-current={index === active ? 'page' : undefined}
						onPointerEnter={() => setPreview(index)}
						onFocus={() => setPreview(index)}
						onClick={(event) => handleClick(event, index, link.href)}
						className={`block rounded-full px-5 py-2 text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-400 ${
							index === target ? 'text-white' : 'text-mist-300 hover:text-mist-100'
						}`}
					>
						{link.label}
					</a>
				</li>
			))}
		</ul>
	);
};

export default NavPill;
