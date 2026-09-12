import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { SocialLink } from '../../data/site';
import { ui, type Locale } from '../../i18n/ui';
import { SOCIAL_ICONS, STROKE } from './icons';

interface Props {
	locale: Locale;
	social: SocialLink[];
	cv: string;
}

const labels = {
	en: { menu: 'Page actions', page: 'Page', top: 'Scroll to top', back: 'Go back', refresh: 'Refresh' },
	es: { menu: 'Acciones de página', page: 'Página', top: 'Volver arriba', back: 'Volver atrás', refresh: 'Recargar' },
};

const itemClass = 'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-mist-300 outline-none hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.08] focus:text-white';
const Icon = ({ children }: { children: ReactNode }) => <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden="true">{children}</svg>;

export default function ContextMenu({ locale, social, cv }: Props) {
	const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const previousFocus = useRef<HTMLElement | null>(null);
	const t = ui[locale];
	const copy = labels[locale];
	const close = (restoreFocus = false) => {
		setPosition(null);
		if (restoreFocus) previousFocus.current?.focus({ preventScroll: true });
	};

	useEffect(() => {
		const open = (event: MouseEvent) => {
			const target = event.target instanceof Element ? event.target : null;
			if (event.shiftKey || target?.closest('input, textarea, select, [contenteditable="true"], dialog[open]') || window.getSelection()?.toString()) return;
			event.preventDefault();
			if (!menuRef.current?.contains(document.activeElement)) {
				previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			}
			setPosition({ x: event.clientX, y: event.clientY });
		};
		const dismiss = () => setPosition(null);
		const outside = (event: PointerEvent) => {
			if (event.target instanceof Node && !menuRef.current?.contains(event.target)) dismiss();
		};
		document.addEventListener('contextmenu', open);
		document.addEventListener('pointerdown', outside);
		window.addEventListener('resize', dismiss);
		window.addEventListener('scroll', dismiss);
		window.addEventListener('blur', dismiss);
		return () => {
			document.removeEventListener('contextmenu', open);
			document.removeEventListener('pointerdown', outside);
			window.removeEventListener('resize', dismiss);
			window.removeEventListener('scroll', dismiss);
			window.removeEventListener('blur', dismiss);
		};
	}, []);

	useLayoutEffect(() => {
		const menu = menuRef.current;
		if (!menu || !position) return;
		const { width, height } = menu.getBoundingClientRect();
		menu.style.left = `${Math.max(8, Math.min(position.x, window.innerWidth - width - 8))}px`;
		menu.style.top = `${Math.max(8, Math.min(position.y, window.innerHeight - height - 8))}px`;
		menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus({ preventScroll: true });
	}, [position]);

	const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape' || event.key === 'Tab') {
			event.preventDefault();
			close(true);
			return;
		}
		const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
		const current = items.indexOf(document.activeElement as HTMLElement);
		let next: number;
		switch (event.key) {
			case 'ArrowDown': next = (current + 1) % items.length; break;
			case 'ArrowUp': next = (current - 1 + items.length) % items.length; break;
			case 'Home': next = 0; break;
			case 'End': next = items.length - 1; break;
			default: return;
		}
		event.preventDefault();
		items[next]?.focus();
	};

	if (!position) return null;
	return createPortal(
		<div ref={menuRef} role="menu" aria-label={copy.menu} onKeyDown={handleKey}
			style={{ left: position.x, top: position.y }}
			className="fixed z-[100] max-h-[calc(100dvh-1rem)] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-2xl border border-white/15 bg-ink-950/95 p-2 shadow-[0_16px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(215,165,128,0.45)] backdrop-blur-xl">
			<div role="group" aria-label={t.connect}>
				<p className="px-3 pt-3 pb-2 text-[0.65rem] font-medium tracking-widest text-mist-500 uppercase">{t.connect}</p>
				<a role="menuitem" tabIndex={-1} href={cv} download className={itemClass} onClick={() => close(true)}>
					<Icon><path {...STROKE} d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4" /></Icon>
					{t.downloadCV}<span className="ml-auto rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] tracking-wider text-mist-500">PDF</span>
				</a>
				{social.map((link) => <a key={link.icon} role="menuitem" tabIndex={-1} href={link.href}
					target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer"
					className={itemClass} onClick={() => close(true)}>
					<Icon>{SOCIAL_ICONS[link.icon]}</Icon>{link.label}
				</a>)}
			</div>
			<div role="separator" className="mx-3 my-2 h-px bg-white/[0.06]" />
			<div role="group" aria-label={copy.page}>
				<p className="px-3 pt-2 pb-2 text-[0.65rem] font-medium tracking-widest text-mist-500 uppercase">{copy.page}</p>
				<button role="menuitem" tabIndex={-1} className={itemClass} onClick={() => {
					close(true);
					window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
				}}><Icon><path {...STROKE} d="M12 20V4m-6 6 6-6 6 6" /></Icon>{copy.top}</button>
				<button role="menuitem" tabIndex={-1} className={itemClass} onClick={() => { close(true); window.history.back(); }}>
					<Icon><path {...STROKE} d="M20 12H4m6-6-6 6 6 6" /></Icon>{copy.back}
				</button>
				<button role="menuitem" tabIndex={-1} className={itemClass} onClick={() => window.location.reload()}>
					<Icon><path {...STROKE} d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 2M5 16a8 8 0 0 0 13 2" /></Icon>{copy.refresh}
				</button>
			</div>
		</div>, document.body,
	);
}
