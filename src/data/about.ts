import { withBase } from '../lib/base';

/** Served straight out of `public/`, no processing. */
export const cv = withBase('/cv_jorge_luis_hernandez.pdf');

export const location = 'Montevideo, Uruguay';

export const headline = 'Montevideo-based software engineer building systems that hold up.';

export const education = {
	degree: 'Computer Engineering',
	school: 'University of Ciego de Ávila',
};

export interface Language {
	name: string;
	level: string;
}

export const languages: Language[] = [
	{ name: 'Spanish', level: 'Native' },
	{ name: 'English', level: 'Intermediate' },
];
