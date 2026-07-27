import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * A trigger in the header that opens a floating dock at the bottom of the
 * viewport, carrying the navigation, the social links and the language control.
 * Below `lg` it is the only navigation there is.
 *
 * The dock is portalled to `document.body`: rendering it inside the header would
 * leave it at the mercy of that element's `overflow: hidden` and stacking
 * context, and a dialog should not be clippable by whatever wraps it.
 */

type PageIcon = 'home' | 'user' | 'folder' | 'layers' | 'message';
type SocialIcon = 'github' | 'linkedin' | 'mail';

interface NavLink {
	label: string;
	href: string;
	icon?: PageIcon;
}

interface SocialLink {
	label: string;
	href: string;
	icon: SocialIcon;
}

interface QuickMenuProps {
	links: NavLink[];
	social: SocialLink[];
}

const LANGUAGES = [
	{ code: 'en', label: 'EN' },
	{ code: 'es', label: 'ES' },
];

const LANGUAGE_KEY = 'portfolio:language';

const FOCUSABLE = 'a[href], button:not([disabled])';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const STROKE = {
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 1.6,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
} as const;

const PAGE_ICONS: Record<PageIcon, ReactNode> = {
	home: <path {...STROKE} d="M3.5 10.5 12 3.5l8.5 7M6 9.8V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.8" />,
	user: (
		<>
			<circle {...STROKE} cx="12" cy="8.5" r="3.75" />
			<path {...STROKE} d="M4.75 20a7.25 7.25 0 0 1 14.5 0" />
		</>
	),
	folder: (
		<path
			{...STROKE}
			d="M3.5 7.25A1.5 1.5 0 0 1 5 5.75h3.9l1.85 2.3h8.25a1.5 1.5 0 0 1 1.5 1.5v8.7a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V7.25Z"
		/>
	),
	layers: (
		<>
			<path {...STROKE} d="m12 3.5 8.5 4.25L12 12 3.5 7.75 12 3.5Z" />
			<path {...STROKE} d="m3.5 12 8.5 4.25L20.5 12M3.5 16.25 12 20.5l8.5-4.25" />
		</>
	),
	message: (
		<path
			{...STROKE}
			d="M4.5 5.5h15a1 1 0 0 1 1 1v8.75a1 1 0 0 1-1 1H9.4L4.5 20V6.5a1 1 0 0 1 1-1Z"
		/>
	),
};

const SOCIAL_ICONS: Record<SocialIcon, ReactNode> = {
	github: (
		<path
			fill="currentColor"
			d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"
		/>
	),
	linkedin: (
		<path
			fill="currentColor"
			d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"
		/>
	),
	mail: (
		<path
			{...STROKE}
			d="M3 7.5 12 13l9-5.5M4.5 5h15a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5Z"
		/>
	),
};

const SectionLabel = ({ children }: { children: ReactNode }) => (
	<p className="px-1 pb-2 text-[0.68rem] font-medium tracking-[0.18em] text-mist-500 uppercase">
		{children}
	</p>
);

const QuickMenu = ({ links, social }: QuickMenuProps) => {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [language, setLanguage] = useState('en');
	const [reduceMotion, setReduceMotion] = useState(false);
	const [current, setCurrent] = useState('');

	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const panelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setMounted(true);
		setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

		const stored = window.localStorage.getItem(LANGUAGE_KEY);
		if (stored) setLanguage(stored);
	}, []);

	// The trigger wears a ⌘, so the shortcut it implies has to exist. A key glyph
	// that opens nothing is a label for a control that isn't there.
	useEffect(() => {
		const handleShortcut = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;

			event.preventDefault();
			setOpen((value) => !value);
		};

		document.addEventListener('keydown', handleShortcut);

		return () => document.removeEventListener('keydown', handleShortcut);
	}, []);

	useEffect(() => {
		if (!open) return;

		setCurrent(window.location.hash || links[0]?.href || '');

		const panel = panelRef.current;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false);
				return;
			}

			if (event.key !== 'Tab' || !panel) return;

			// Keep tabbing inside the dock while it is open: it covers the page, so
			// letting focus walk out to the content behind it strands the keyboard.
			const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = previous;
			triggerRef.current?.focus();
		};
	}, [open, links]);

	const chooseLanguage = (code: string) => {
		setLanguage(code);
		// Remembered only. There are no translated routes yet, so switching cannot
		// navigate anywhere; wiring Astro i18n is what makes this do something.
		window.localStorage.setItem(LANGUAGE_KEY, code);
	};

	const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
		// Same guard as the pill nav: sections that do not exist yet should not put
		// a dead hash in the address bar.
		if (!document.getElementById(href.replace('#', ''))) event.preventDefault();
		setOpen(false);
	};

	/** Staggered entrance in reading order. Closing collapses the stagger to zero
	    so the panel leaves as one piece instead of unravelling. */
	const rise = (step: number) => {
		if (reduceMotion) return undefined;

		const delay = open ? 70 + step * 40 : 0;

		return {
			opacity: open ? 1 : 0,
			transform: open ? 'translateY(0)' : 'translateY(10px)',
			transition: `opacity 400ms ${EASE} ${delay}ms, transform 400ms ${EASE} ${delay}ms`,
		};
	};

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen(true)}
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-label="Open menu"
				title="Menu (⌘K)"
				className="flex size-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-ink-950/50 text-mist-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-colors duration-300 hover:border-white/20 hover:bg-ink-900/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-400"
			>
				<svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
					<path {...STROKE} strokeWidth={1.7} d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
				</svg>
			</button>

			{mounted &&
				createPortal(
					<div
						className={`fixed inset-0 z-50 transition-opacity duration-300 ${
							open ? 'opacity-100' : 'pointer-events-none opacity-0'
						}`}
					>
						<button
							type="button"
							tabIndex={-1}
							aria-hidden="true"
							onClick={() => setOpen(false)}
							className="absolute inset-0 h-full w-full cursor-default bg-ink-950/70 backdrop-blur-sm"
						/>

						<div
							ref={panelRef}
							role="dialog"
							aria-modal="true"
							aria-label="Quick menu"
							style={{ transitionTimingFunction: EASE }}
							className={`absolute bottom-5 left-1/2 w-[min(32rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-3xl border border-white/[0.08] bg-ink-900/90 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl transition-[transform,opacity] duration-500 ${
								open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
							}`}
						>
							<div style={rise(0)} className="flex items-center justify-between gap-3 px-1 pb-3">
								<div
									role="group"
									aria-label="Language"
									className="flex items-center gap-0.5 rounded-xl bg-ink-950/60 p-1"
								>
									{LANGUAGES.map((item) => (
										<button
											key={item.code}
											type="button"
											onClick={() => chooseLanguage(item.code)}
											aria-pressed={language === item.code}
											className={`rounded-lg px-3 py-1.5 text-xs tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-clay-400 ${
												language === item.code
													? 'bg-white/10 text-mist-100'
													: 'text-mist-500 hover:text-mist-300'
											}`}
										>
											{item.label}
										</button>
									))}
								</div>

								<button
									type="button"
									onClick={() => setOpen(false)}
									aria-label="Close menu"
									className="flex size-9 items-center justify-center rounded-xl text-mist-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-mist-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-clay-400"
								>
									<svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
										<path {...STROKE} d="m6.5 6.5 11 11m0-11-11 11" />
									</svg>
								</button>
							</div>

							<div className="mx-1 h-px bg-white/[0.07]" />

							<nav aria-label="Site" className="pt-4">
								<div style={rise(1)}>
									<SectionLabel>Pages</SectionLabel>
								</div>

								<ul className="grid grid-cols-2 gap-2">
									{links.map((link, index) => {
										const isCurrent = link.href === current;

										return (
											<li key={link.href} style={rise(2 + index)}>
												<a
													href={link.href}
													aria-current={isCurrent ? 'page' : undefined}
													onClick={(event) => handleNavigate(event, link.href)}
													className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-[0.95rem] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-clay-400 ${
														isCurrent
															? 'border-clay-400/30 bg-clay-500/[0.12] text-clay-200'
															: 'border-white/[0.06] bg-white/[0.03] text-mist-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-mist-100'
													}`}
												>
													<svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden="true">
														{link.icon && PAGE_ICONS[link.icon]}
													</svg>
													{link.label}
												</a>
											</li>
										);
									})}
								</ul>
							</nav>

							<div className="pt-6">
								<div style={rise(2 + links.length)}>
									<SectionLabel>Connect</SectionLabel>
								</div>

								<ul className="flex flex-wrap gap-2">
									{social.map((item, index) => (
										<li key={item.label} style={rise(3 + links.length + index)}>
											<a
												href={item.href}
												target={item.href.startsWith('mailto:') ? undefined : '_blank'}
												rel="noreferrer"
												className="flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] py-2.5 pr-3 pl-4 text-sm text-mist-300 transition-colors duration-200 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-mist-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-clay-400"
											>
												<svg viewBox="0 0 24 24" className="size-[17px] shrink-0" aria-hidden="true">
													{SOCIAL_ICONS[item.icon]}
												</svg>
												{item.label}
												<svg viewBox="0 0 24 24" className="size-3.5 text-mist-500" aria-hidden="true">
													<path {...STROKE} d="M8 16 16 8m-6.5-.5H16.5v7" />
												</svg>
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>,
					document.body
				)}
		</>
	);
};

export default QuickMenu;
