import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const slugs = ['raliopay', 'cubaofertas', 'asynqa', 'tiendi', 'claude-usage-widget'];
const read = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');

test('both locales render translated content and reciprocal language links', () => {
	for (const locale of ['en', 'es']) {
		const prefix = locale === 'es' ? 'es/' : '';
		for (const path of ['', ...slugs.map((slug) => `projects/${slug}/`)]) {
			const html = read(`${prefix}${path}index.html`);
			assert.ok(html.includes(`lang="${locale}"`), `${prefix}${path}: document language`);
			for (const [lang, target] of [['en', path], ['es', `es/${path}`]]) {
				assert.ok(html.includes(`hreflang="${lang}" href="https://jorgelhd94.github.io/portfolio/${target}"`), `${prefix}${path}: ${lang} alternate`);
			}
			assert.ok(html.includes(path ? (locale === 'es' ? 'Desafíos' : 'Challenges') : (locale === 'es' ? 'Ingeniero de software' : 'Software Engineer')));
			for (const match of html.matchAll(/href="(\/portfolio\/[^"#?]*)(?:[^\"]*)"/g)) {
				const target = match[1].slice('/portfolio/'.length);
				const root = new URL(`../dist/${target}`, import.meta.url);
				assert.ok(existsSync(root) || existsSync(new URL(`../dist/${target}/index.html`, import.meta.url)), `Missing local destination: ${match[1]}`);
			}
			if (path) {
				assert.ok(html.includes(`href="/portfolio/${prefix}#projects"`), 'Back link retains locale');
				assert.equal([...html.matchAll(/class="hop hop-(?:prev|next)"/g)].length, 2);
			}
		}
	}
});

test('project translations retain the supplied challenges and Tiendi scope', () => {
	const ralio = read('es/projects/raliopay/index.html');
	const challenges = ralio.split('id="challenges-title"')[1].split('</ul>')[0];
	const items = [...challenges.matchAll(/<li[^>]*>(.*?)<\/li>/g)].map((match) => match[1]);
	assert.equal(items.length, 4);
	assert.ok(items[2].includes('KYC/KYB'));
	assert.ok(read('es/projects/tiendi/index.html').includes('sin integración de pagos'));
	assert.ok(read('projects/tiendi/index.html').includes('no payment integration'));
});

test('error pages have valid equivalent language destinations', () => {
	for (const path of ['404.html', 'es/404/index.html']) {
		const html = read(path);
		assert.ok(html.includes('href="/portfolio/404.html"'));
		assert.ok(html.includes('href="/portfolio/es/404/"'));
	}
});
