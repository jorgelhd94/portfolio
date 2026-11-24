import QRCode from 'qrcode';
import type { Locale } from '../i18n/ui';
import { localePath } from '../i18n/routes';

export interface ShareTarget {
	url: string;
	qr: string;
}

const cache = new Map<string, Promise<ShareTarget>>();

/** Rendered at build time, so the dialog ships an inline SVG instead of an encoder. */
export function shareTarget(locale: Locale, site: URL | undefined): Promise<ShareTarget> {
	const url = new URL(localePath(locale), site ?? 'http://localhost').href;
	let target = cache.get(url);
	if (!target) {
		target = QRCode.toString(url, {
			type: 'svg',
			margin: 0,
			errorCorrectionLevel: 'M',
			color: { dark: '#0a0a0a', light: '#00000000' },
		}).then((qr) => ({ url, qr }));
		cache.set(url, target);
	}
	return target;
}
