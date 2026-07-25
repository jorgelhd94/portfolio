import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Quick menu: a trigger in the header that opens a floating dock at the bottom
 * of the viewport. It carries the navigation, the social links and the language
 * control, and below `md` it is the only navigation there is.
 *
 * The dock is portalled to `document.body`. Rendering it inside the header would
 * leave it at the mercy of that element's `overflow: hidden` and stacking
 * context; a dialog should not be able to be clipped by whatever wraps it.
 */

interface NavLink {
	label: string;
	href: string;
}

interface SocialLink {
	label: string;
	href: string;
	icon: IconName;
}

interface QuickMenuProps {
	links: NavLink[];
	social: SocialLink[];
}

type IconName = 'github' | 'linkedin' | 'mail';

const LANGUAGES = [
	{ code: 'en', label: 'EN' },
	{ code: 'es', label: 'ES' },
];

const LANGUAGE_KEY = 'portfolio:language';

const FOCUSABLE = 'a[href], button:not([disabled])';

const ICONS: Record<IconName, ReactNode> = {
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
			d="M3 7.5 12 13l9-5.5M4.5 5h15a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5Z"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	),
};

const QuickMenu = ({ links, social }: QuickMenuProps) => {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [language, setLanguage] = useState('en');

	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const panelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setMounted(true);

		const stored = window.localStorage.getItem(LANGUAGE_KEY);
		if (stored) setLanguage(stored);
	}, []);

	useEffect(() => {
		if (!open) return;

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
	}, [open]);

	const chooseLanguage = (code: string) => {
		setLanguage(code);
		// Remembered only. There are no translated routes yet, so switching cannot
		// navigate anywhere; wiring Astro i18n is what makes this do something.
		window.localStorage.setItem(LANGUAGE_KEY, code);
	};

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen(true)}
				aria-haspopup="dialog"
				aria-expanded={open}
				className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-2 pr-5 pl-4 text-sm text-mist-100 backdrop-blur-sm transition-colors duration-300 hover:border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-400"
			>
				<span className="grid grid-cols-2 gap-[3px]">
					{[0, 1, 2, 3].map((index) => (
						<span
							key={index}
							className="size-[5px] rounded-[1px] bg-current opacity-55 transition-opacity duration-300 group-hover:opacity-100"
							style={{ transitionDelay: `${index * 70}ms` }}
						/>
					))}
				</span>
				Menu
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
							className={`absolute bottom-5 left-1/2 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-white/10 bg-ink-900/90 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
								open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
							}`}
						>
							<nav aria-label="Site" className="p-1">
								<ul>
									{links.map((link) => (
										<li key={link.href}>
											<a
												href={link.href}
												onClick={(event) => {
													// Same guard as the pill nav: sections that do not exist yet
													// should not put a dead hash in the address bar.
													if (!document.getElementById(link.href.replace('#', ''))) {
														event.preventDefault();
													}
													setOpen(false);
												}}
												className="flex items-center justify-between rounded-2xl px-4 py-3 text-[0.95rem] text-mist-300 transition-colors duration-200 hover:bg-white/[0.06] hover:text-mist-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-azure-400"
											>
												{link.label}
												<span className="size-1.5 rounded-[2px] bg-mist-500/50" aria-hidden="true" />
											</a>
										</li>
									))}
								</ul>
							</nav>

							<div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] p-2">
								<div className="flex items-center gap-1">
									{social.map((item) => (
										<a
											key={item.label}
											href={item.href}
											target={item.href.startsWith('mailto:') ? undefined : '_blank'}
											rel="noreferrer"
											aria-label={item.label}
											className="flex size-10 items-center justify-center rounded-xl text-mist-300 transition-colors duration-200 hover:bg-white/[0.07] hover:text-mist-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-azure-400"
										>
											<svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
												{ICONS[item.icon]}
											</svg>
										</a>
									))}
								</div>

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
											className={`rounded-lg px-3 py-1.5 text-xs tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-azure-400 ${
												language === item.code
													? 'bg-white/10 text-mist-100'
													: 'text-mist-500 hover:text-mist-300'
											}`}
										>
											{item.label}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>,
					document.body
				)}
		</>
	);
};

export default QuickMenu;
