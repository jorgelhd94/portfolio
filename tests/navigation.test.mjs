import assert from 'node:assert/strict';
import { test } from 'node:test';
import { preventMissingSection } from '../src/lib/navigation.ts';

test('only missing same-page fragments are blocked', t => {
	const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
	Object.defineProperty(globalThis, 'document', {
		configurable: true, value: { getElementById: id => id === 'projects' ? {} : null },
	});
	t.after(() => {
		if (previous) Object.defineProperty(globalThis, 'document', previous);
		else delete globalThis.document;
	});
	for (const [href, expected] of [['#missing', true], ['#projects', false], ['/portfolio/#projects', false], ['https://example.com', false]]) {
		let prevented = false;
		preventMissingSection({ preventDefault() { prevented = true; } }, href);
		assert.equal(prevented, expected, href);
	}
});
