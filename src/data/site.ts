import { ui, type Locale } from '../i18n/ui';
export type PageIcon = 'home' | 'user' | 'folder' | 'layers';
export type SocialIcon = 'github' | 'linkedin' | 'mail';

export interface NavLink {
	label: string;
	href: string;
	icon: PageIcon;
}

export interface SocialLink {
	label: string;
	href: string;
	icon: SocialIcon;
}

export const navLinks: NavLink[] = [
	{ label: 'Home', href: '#top', icon: 'home' },
	{ label: 'Projects', href: '#projects', icon: 'folder' },
	{ label: 'Stack', href: '#stack', icon: 'layers' },
	{ label: 'About Me', href: '#about', icon: 'user' },
];

export const github = 'https://github.com/jorgelhd94';
export const linkedin = 'https://www.linkedin.com/in/jorgelhd94';
export const email = 'jorgelhd94@gmail.com';

export const social: SocialLink[] = [
	{ label: 'GitHub', href: github, icon: 'github' },
	{ label: 'LinkedIn', href: linkedin, icon: 'linkedin' },
	{ label: 'Mail', href: `mailto:${email}`, icon: 'mail' },
];

export function getNavLinks(locale: Locale): NavLink[] {
	const labels = { '#top': ui[locale].home, '#projects': ui[locale].projects, '#stack': ui[locale].stack, '#about': ui[locale].about };
	return navLinks.map((link) => ({ ...link, label: labels[link.href as keyof typeof labels] ?? link.label }));
}

export function getSocialLinks(locale: Locale): SocialLink[] {
	return social.map((link) => ({ ...link, label: link.icon === 'mail' ? ui[locale].mail : link.label }));
}
