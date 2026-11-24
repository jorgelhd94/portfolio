import { ui, type Locale } from '../../i18n/ui';
import { type MouseEvent, type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { NavLink, SocialLink } from '../../data/site';
import type { ShareTarget } from '../../lib/share';
import { PAGE_ICONS, SOCIAL_ICONS, STROKE } from './icons';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { preventMissingSection } from '../../lib/navigation';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useMenuDialog } from './useMenuDialog';

interface QuickMenuProps {
	locale: Locale;
	languages: Record<Locale, string>;
	links: NavLink[];
	social: SocialLink[];
	cv: string;
	share: ShareTarget;
	// Only one bar opens via the shortcut; either menu can close via it.
	shortcut?: boolean;
}

const LANGUAGES = [
	{ code: 'en', label: 'EN' },
	{ code: 'es', label: 'ES' },
] as const;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const SectionLabel = ({ children }: { children: ReactNode }) => (
	<p className="px-1 pb-2 text-[0.68rem] font-medium tracking-[0.18em] text-mist-500 uppercase">
		{children}
	</p>
);

const TILE =
	'flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[0.95rem] text-mist-300 transition-colors duration-200 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-mist-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-clay-400';

const QuickMenu = ({ links, social, locale, languages, cv, share, shortcut = true }: QuickMenuProps) => {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [view, setView] = useState<'menu' | 'share'>('menu');
	const [copied, setCopied] = useState(false);
	const [canShare, setCanShare] = useState(false);
	const t = ui[locale];
	const reduceMotion = useReducedMotion();
	const current = useActiveSection(links);

	const { dialogRef, visible } = useMenuDialog(open, reduceMotion);

	useEffect(() => {
		setMounted(true);
		setCanShare(typeof navigator.share === 'function');
	}, []);

	// The control that switched views is unmounted by the switch, so focus would
	// fall to the document.
	useEffect(() => {
		if (open) dialogRef.current?.querySelector<HTMLElement>('div button')?.focus();
	}, [view]);

	useEffect(() => {
		if (open) return;
		const reset = window.setTimeout(() => { setView('menu'); setCopied(false); }, 300);
		return () => window.clearTimeout(reset);
	}, [open]);

	useEffect(() => {
		const handleShortcut = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;

			if (event.defaultPrevented) return;
			if (!open && (!shortcut || document.querySelector('dialog[open]'))) return;
			event.preventDefault();
			setOpen((value) => !value);
		};

		document.addEventListener('keydown', handleShortcut);

		return () => document.removeEventListener('keydown', handleShortcut);
	}, [shortcut, open]);

	const chooseLanguage = (code: Locale) => {
		window.location.assign(languages[code] + window.location.search + window.location.hash);
	};

	const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
		preventMissingSection(event, href);
		setOpen(false);
	};

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(share.url);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	};

	const nativeShare = () => {
		navigator.share?.({ title: 'Jorge Hernández', url: share.url }).catch(() => {});
	};

	/** Staggered entrance in reading order. Closing collapses the stagger to zero
	    so the panel leaves as one piece instead of unravelling. */
	const rise = (step: number) => {
		if (reduceMotion) return undefined;

		const delay = visible ? 70 + step * 40 : 0;

		return {
			opacity: visible ? 1 : 0,
			transform: visible ? 'translateY(0)' : 'translateY(10px)',
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
				aria-label={t.openMenu}
				title={`${t.menu} (⌘K)`}
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
						onCancel={(event) => {
							event.preventDefault();
							if (view === 'share') setView('menu');
							else setOpen(false);
						}}
						aria-label={t.quickMenu}
						className={`m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-inherit backdrop:bg-transparent fixed inset-0 z-50 transition-opacity duration-300 motion-reduce:transition-none ${
							visible ? 'opacity-100' : 'pointer-events-none opacity-0'
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
								visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
							}`}
						>
							<div style={rise(0)} className="flex items-center justify-between gap-3 px-1 pb-3">
								{view === 'share' ? (
									<button
										type="button"
										onClick={() => setView('menu')}
										className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-mist-300 transition-colors duration-200 hover:bg-white/[0.06] hover:text-mist-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-clay-400"
									>
										<svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
											<path {...STROKE} d="M19 12H5m6-6-6 6 6 6" />
										</svg>
										{t.back}
									</button>
								) : (
								<div
									role="group"
									aria-label={t.language}
									className="flex items-center gap-0.5 rounded-xl bg-ink-950/60 p-1"
								>
									{LANGUAGES.map((item) => (
										<button
											key={item.code}
											type="button"
											onClick={() => chooseLanguage(item.code)}
											aria-pressed={locale === item.code}
											className={`rounded-lg px-3 py-1.5 text-xs tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-clay-400 ${
												locale === item.code
													? 'bg-white/10 text-mist-100'
													: 'text-mist-500 hover:text-mist-300'
											}`}
										>
											{item.label}
										</button>
									))}
								</div>
								)}

								<button
									type="button"
									onClick={() => setOpen(false)}
									aria-label={t.closeMenu}
									className="flex size-9 items-center justify-center rounded-xl text-mist-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-mist-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-clay-400"
								>
									<svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
										<path {...STROKE} d="m6.5 6.5 11 11m0-11-11 11" />
									</svg>
								</button>
							</div>

							<div className="mx-1 h-px bg-white/[0.07]" />

							{view === 'share' ? (
							<div className="flex flex-col items-center gap-5 pt-5 pb-2 text-center">
								<div>
									<p className="text-lg font-semibold text-mist-100">{t.sharePortfolio}</p>
									<p className="mt-1 text-sm text-mist-500">{t.scanToOpen}</p>
								</div>

								<div
									className="rounded-2xl bg-white p-4 [&_svg]:block [&_svg]:size-44"
									role="img"
									aria-label={`QR — ${share.url}`}
									dangerouslySetInnerHTML={{ __html: share.qr }}
								/>

								<p className="max-w-full truncate text-xs text-mist-300">{share.url.replace(/^https?:\/\//, '')}</p>

								<div className="flex w-full gap-2">
									<button type="button" onClick={copyLink} className={`${TILE} flex-1 justify-center`} aria-live="polite">
										<svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden="true">
											{copied ? (
												<path {...STROKE} d="m5 12.5 4.5 4.5L19 7.5" />
											) : (
												<>
													<rect {...STROKE} x="8.5" y="8.5" width="11" height="11" rx="2" />
													<path {...STROKE} d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
												</>
											)}
										</svg>
										{copied ? t.copied : t.copyLink}
									</button>

									{canShare && (
										<button type="button" onClick={nativeShare} className={`${TILE} flex-1 justify-center`}>
											<svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden="true">
												<path {...STROKE} d="M12 15V4m-4.5 4.5L12 4l4.5 4.5M6 12.5V18a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 18v-5.5" />
											</svg>
											{t.shareVia}
										</button>
									)}
								</div>
							</div>
							) : (
								<>
							<nav aria-label={t.site} className="pt-4">
								<div style={rise(1)}>
									<SectionLabel>{t.pages}</SectionLabel>
								</div>

								<ul className="grid grid-cols-2 gap-2">
									{links.map((link, index) => {
										const isCurrent = link.href === current;

										return (
											<li key={link.href} style={rise(2 + index)}>
												<a
													href={link.href}
													aria-current={isCurrent ? 'location' : undefined}
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
									<SectionLabel>{t.files}</SectionLabel>
								</div>

								<div className="grid grid-cols-2 gap-2">
									<a href={cv} download style={rise(3 + links.length)} className={`${TILE} min-w-0 whitespace-nowrap max-sm:gap-2.5 max-sm:px-3`}>
										<svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden="true">
											<path {...STROKE} d="M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 19.5h14" />
										</svg>
										{t.curriculum}
										<span className="ml-auto hidden rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] tracking-wider text-mist-500 sm:inline">PDF</span>
									</a>

									<button type="button" onClick={() => setView('share')} style={rise(4 + links.length)} className={`${TILE} text-left max-sm:gap-2.5 max-sm:px-3`}>
										<svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden="true">
											<path {...STROKE} d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
											<path {...STROKE} d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM14 20h.01M20 14h.01" />
										</svg>
										{t.share}
									</button>
								</div>
							</div>

							<div className="pt-6">
								<div style={rise(5 + links.length)}>
									<SectionLabel>{t.connect}</SectionLabel>
								</div>

								<ul className="flex flex-wrap gap-2">
									{social.map((item, index) => (
										<li key={item.label} style={rise(6 + links.length + index)}>
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
								</>
							)}
						</div>
					</dialog>,
					document.body
				)}
		</>
	);
};

export default QuickMenu;
