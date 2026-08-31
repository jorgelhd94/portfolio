import { withBase } from '../lib/base';

/** Served straight out of `public/`, no processing. */
export const cv = withBase('/cv_jorge_luis_hernandez.pdf');

export const location = 'Montevideo, Uruguay';

export const headline = 'Montevideo-based software engineer building systems that hold up.';

export const summary = [
	'I am a software engineer based in Montevideo, six years into building web systems for fintech, e-commerce and enterprise clients.',
	'Most of my work is backend: Go microservices behind production payment platforms, where idempotency, fault tolerance and a clean architecture matter more than novelty. I am comfortable across the rest of the stack too — Python and Django on one side, TypeScript and React on the other — and I lean on LLMs daily to ship faster without shipping worse.',
];

export const education = {
	degree: 'Computer Engineering',
	school: 'University of Ciego de Ávila',
};

export interface Language {
	name: string;
	level: string;
	/** Drives the meter only; the written level is the claim being made. */
	strength: number;
}

export const languages: Language[] = [
	{ name: 'Spanish', level: 'Native', strength: 1 },
	{ name: 'English', level: 'Intermediate', strength: 0.6 },
];
