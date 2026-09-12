import type { Locale } from '../i18n/ui';
import { ui } from '../i18n/ui';
import { spanishProjects } from './projects.es';
import type { TechId } from './tech';

export interface Project {
	name: string;
	/** Also the filename of its shot in `src/assets/projects/`. */
	slug: string;
	kind: string;
	blurb: string;
	challenges: string[];
	href: string;
	/** What the button leads to, so a repository is never sold as a live site. */
	linkLabel: string;
	/* * Who owns the work, when that is not me, as the noun phrase the notice
	   reads * out — a name where naming is fine, a description where it is not. */
	ownedBy?: string;
	tech: TechId[];
	/** Where the clay spill lights the placeholder art from, as percentages. */
	spill: { x: string; y: string };
}

export const projects: Project[] = [
	{
		name: 'RalioPay',
		slug: 'raliopay',
		challenges: [
			'Keep the core platform available and resilient to failures.',
			'Orchestrate payments across bank accounts and crypto rails.',
			'Integrate KYC/KYB compliance services and SEON.',
			'Handle asynchronous payments reliably, with idempotent operations that prevent duplicate effects when retrying.',
		],
		kind: 'Fintech · Banking as a Service',
		blurb:
			'Banking as a Service platform with bank accounts and crypto rails. I build the Go microservices that orchestrate its payments — asynchronous, fault-tolerant, idempotent.',
		href: 'https://raliopay.com/',
		linkLabel: 'Visit site',
		ownedBy: 'Ralio',
		tech: ['go', 'postgres', 'redis', 'docker'],
		spill: { x: '82%', y: '14%' },
	},
	{
		name: 'CubaOfertas',
		slug: 'cubaofertas',
		challenges: [
			'Collect product data daily from all integrated stores and keep the collection service highly available.',
			'Classify products and normalize data from different stores into a unified format.',
			'Optimize product search so users can find items quickly.',
			'Train a machine learning model to classify products automatically.',
			'Build a shopping basket within the user’s budget using the cheapest products across stores.',
		],
		kind: 'Price Comparison · AI',
		blurb:
			'Price comparison for the Cuban market: Python scrapers unify product data across stores, and an AI assistant turns a stated budget into a grocery list.',
		href: 'https://cubaofertas.com/',
		linkLabel: 'Visit site',
		ownedBy: 'the company I built it for',
		tech: ['python', 'django', 'nextjs', 'postgres', 'docker'],
		spill: { x: '50%', y: '10%' },
	},
	{
		name: 'AsynQA',
		slug: 'asynqa',
		challenges: [
			'Make asynq queues easier to debug in Go microservices without an application frontend.',
			'Inspect asynchronous and periodic tasks to understand their payloads, execution state and retries.',
			'Trigger tasks directly with custom test data to reproduce issues and test different scenarios.',
		],
		kind: 'Developer Tool · Open Source',
		blurb:
			'A desktop client for asynq task queues on Redis — browse queues, inspect payloads and retries, enqueue tasks from a JSON editor, watch workers live.',
		href: 'https://github.com/jorgelhd94/asynqa',
		linkLabel: 'View on GitHub',
		tech: ['go', 'react', 'typescript', 'redis'],
		spill: { x: '16%', y: '22%' },
	},
	{
		name: 'Tiendi',
		slug: 'tiendi',
		challenges: [
			'Build an e-commerce back office to manage the store’s catalogue.',
			'Create a customer-facing catalogue storefront without payment integration.',
		],
		kind: 'E-commerce',
		blurb:
			'A catalogue storefront for household goods with an e-commerce back office and no payment integration — Next.js on the front, Supabase behind it.',
		href: 'https://tiendi.vercel.app/',
		linkLabel: 'Visit site',
		tech: ['nextjs', 'supabase', 'typescript', 'tailwind'],
		spill: { x: '22%', y: '76%' },
	},
	{
		name: 'Claude Usage Widget',
		slug: 'claude-usage-widget',
		challenges: [
			'Make it easy to check Claude Code subscription usage from a desktop widget.',
		],
		kind: 'Desktop App · Open Source',
		blurb:
			'A Windows tray app that keeps Claude Code usage in view — live limits and countdowns, with a tray icon that warms as they close in.',
		href: 'https://github.com/jorgelhd94/claude-usage-widget',
		linkLabel: 'View on GitHub',
		tech: ['rust', 'react', 'typescript', 'tailwind'],
		spill: { x: '78%', y: '80%' },
	},
];

export function getProjects(locale: Locale): Project[] {
	return projects.map((project) => {
		const translation = locale === 'es' ? spanishProjects[project.slug] : undefined;
		if (locale === 'es' && !translation) throw new Error(`Missing Spanish project: ${project.slug}`);
		return {
			...project,
			...translation,
			linkLabel: project.linkLabel === 'Visit site' ? ui[locale].visitSite : ui[locale].viewGithub,
		};
	});
}
