import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from './ui';

export function localePath(locale: Locale, path = '') {
	const suffixIndex = path.search(/[?#]/);
	const pathname = suffixIndex < 0 ? path : path.slice(0, suffixIndex);
	const suffix = suffixIndex < 0 ? '' : path.slice(suffixIndex);
	return getRelativeLocaleUrl(locale, pathname.replace(/^\//, '')) + suffix;
}

export function languageLinks(pathname: string) {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const relative = pathname === base || pathname.startsWith(`${base}/`) ? pathname.slice(base.length) : pathname;
	const path = relative.replace(/^\/es(?=\/|$)/, '');
	if (/^\/404(?:\.html|\/)?$/.test(path)) {
		return { en: `${base}/404.html`, es: localePath('es', '404') };
	}
	return { en: localePath('en', path), es: localePath('es', path) };
}
