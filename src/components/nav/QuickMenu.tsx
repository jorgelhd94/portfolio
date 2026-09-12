import { type MouseEvent, type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { NavLink, SocialLink } from '../../data/site';
import { PAGE_ICONS, SOCIAL_ICONS, STROKE } from './icons';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { preventMissingSection } from '../../lib/navigation';
import { useMenuDialog } from './useMenuDialog';

interface QuickMenuProps {
	links: NavLink[];
	social: SocialLink[];
	// Only one of the two navigation bars owns the document shortcut.
	shortcut?: boolean;
}

const LANGUAGES = [
	{ code: 'en', label: 'EN' },
	{ code: 'es', label: 'ES' },
];

const LANGUAGE_KEY = 'portfolio:language';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const SectionLabel = ({ children }: { children: ReactNode }) => (
	<p className="px-1 pb-2 text-[0.68rem] font-medium tracking-[0.18em] text-mist-500 uppercase">
		{children}
	</p>
);

const QuickMenu = ({ links, social, shortcut = true }: QuickMenuProps) => {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [language, setLanguage] = useState('en');
	const reduceMotion = useReducedMotion();
	const [current, setCurrent] = useState('');

	const dialogRef = useMenuDialog(open);

	useEffect(() => {
		setMounted(true);

		try {
			const stored = window.localStorage.getItem(LANGUAGE_KEY);
			if (stored && LANGUAGES.some(({ code }) => code === stored)) setLanguage(stored);
		} catch {
			// Storage may be disabled by the browser. The menu still works.
		}
	}, []);

	useEffect(() => {
		if (!shortcut) return;

		const handleShortcut = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;

			if (document.querySelector('dialog[open]') && !open) return;
			event.preventDefault();
			setOpen((value) => !value);
		};

		document.addEventListener('keydown', handleShortcut);

		return () => document.removeEventListener('keydown', handleShortcut);
	}, [shortcut, open]);

	useEffect(() => {
		if (open) setCurrent(window.location.hash || links[0]?.href || '');
	}, [open, links]);

	const chooseLanguage = (code: string) => {
		setLanguage(code);
		// Remembered only. There are no translated routes yet, so switching cannot
		// navigate anywhere; wiring Astro i18n is what makes this do something.
		try {
			window.localStorage.setItem(LANGUAGE_KEY, code);
		} catch {
			// Keep the selection for this visit when storage is unavailable.
		}
	};

	const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
		preventMissingSection(event, href);
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
					<dialog
						ref={dialogRef}
						onCancel={() => setOpen(false)}
						aria-label="Quick menu"
						className={`m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-inherit backdrop:bg-transparent fixed inset-0 z-50 transition-opacity duration-300 ${
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
							style={{ transitionTimingFunction: EASE }}
							className={`absolute bottom-5 left-1/2 w-[min(32rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-3xl border border-white/[0.08] bg-ink-900/90 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl transition-[transform,opacity] duration-500 motion-reduce:transition-none ${
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
															? 'border-white/20 bg-white/[0.08] text-mist-100'
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
					</dialog>,
					document.body
				)}
		</>
	);
};

export default QuickMenu;
