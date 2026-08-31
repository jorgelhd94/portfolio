export type TechId =
	| 'go'
	| 'python'
	| 'typescript'
	| 'rust'
	| 'django'
	| 'nodejs'
	| 'postgres'
	| 'mysql'
	| 'redis'
	| 'rabbitmq'
	| 'supabase'
	| 'react'
	| 'nextjs'
	| 'astro'
	| 'tailwind'
	| 'aws'
	| 'docker'
	| 'linux'
	| 'git'
	| 'githubactions'
	| 'digitalocean'
	| 'vercel'
	| 'datadog'
	| 'grafana'
	| 'claudecode'
	| 'codex';

export interface TechMeta {
	label: string;
	/** Official home. Every entry has one; the chips are links because of it. */
	href: string;
}

export const TECH: Record<TechId, TechMeta> = {
	go: { label: 'Go', href: 'https://go.dev' },
	python: { label: 'Python', href: 'https://www.python.org' },
	typescript: { label: 'TypeScript', href: 'https://www.typescriptlang.org' },
	rust: { label: 'Rust', href: 'https://www.rust-lang.org' },
	django: { label: 'Django', href: 'https://www.djangoproject.com' },
	nodejs: { label: 'Node.js', href: 'https://nodejs.org' },
	postgres: { label: 'PostgreSQL', href: 'https://www.postgresql.org' },
	mysql: { label: 'MySQL', href: 'https://www.mysql.com' },
	redis: { label: 'Redis', href: 'https://redis.io' },
	rabbitmq: { label: 'RabbitMQ', href: 'https://www.rabbitmq.com' },
	supabase: { label: 'Supabase', href: 'https://supabase.com' },
	react: { label: 'React', href: 'https://react.dev' },
	nextjs: { label: 'Next.js', href: 'https://nextjs.org' },
	astro: { label: 'Astro', href: 'https://astro.build' },
	tailwind: { label: 'Tailwind CSS', href: 'https://tailwindcss.com' },
	aws: { label: 'AWS', href: 'https://aws.amazon.com' },
	docker: { label: 'Docker', href: 'https://www.docker.com' },
	linux: { label: 'Linux', href: 'https://www.kernel.org' },
	git: { label: 'Git', href: 'https://git-scm.com' },
	githubactions: { label: 'GitHub Actions', href: 'https://github.com/features/actions' },
	digitalocean: { label: 'DigitalOcean', href: 'https://www.digitalocean.com' },
	vercel: { label: 'Vercel', href: 'https://vercel.com' },
	datadog: { label: 'Datadog', href: 'https://www.datadoghq.com' },
	grafana: { label: 'Grafana', href: 'https://grafana.com' },
	claudecode: { label: 'Claude Code', href: 'https://claude.com/product/claude-code' },
	codex: { label: 'Codex', href: 'https://openai.com/codex/' },
};
