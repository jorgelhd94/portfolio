import type { ReactNode } from 'react';
import { socialIcons } from '../../data/socialIcons';
import type { PageIcon, SocialIcon } from '../../data/site';

export const STROKE = {
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 1.6,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
} as const;

export const PAGE_ICONS: Record<PageIcon, ReactNode> = {
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
};

export const SOCIAL_ICONS: Record<SocialIcon, ReactNode> = {
	github: <path fill="currentColor" d={socialIcons.github} />,
	linkedin: <path fill="currentColor" d={socialIcons.linkedin} />,
	mail: <path {...STROKE} d={socialIcons.mail} />,
};
