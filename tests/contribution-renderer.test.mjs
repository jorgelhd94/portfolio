import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createContributionText } from '../src/components/visuals/contribution-text/renderer.ts';

function createEnvironment(t) {
	const frames = new Map();
	const listeners = new Map();
	const observers = [];
	let nextFrame = 0;
	let resolveFonts;
	let dissolve = '0';
	let draws = 0;
	const context = {
		font: '',
		measureText: () => ({ width: 100, actualBoundingBoxAscent: 80, actualBoundingBoxDescent: 20 }),
		save() {}, restore() {}, translate() {}, scale() {}, fillText() {}, setTransform() {},
		clearRect() { draws++; }, fillRect() {},
		getImageData: (_x, _y, width, height) => ({ data: new Uint8ClampedArray(width * height * 4).fill(255) }),
	};
	const makeCanvas = () => ({
		style: {}, getContext: () => context,
		getBoundingClientRect: () => ({ left: 0, top: 0, width: 344, height: 344 }),
	});
	const globals = {
		window: {
			devicePixelRatio: 1, innerHeight: 900,
			addEventListener: (name, callback) => listeners.set(name, callback),
			removeEventListener: (name) => listeners.delete(name),
		},
		document: {
			documentElement: {}, createElement: makeCanvas,
			fonts: { ready: new Promise(resolve => { resolveFonts = resolve; }) },
		},
		getComputedStyle: () => ({ getPropertyValue: name => name === '--dissolve' ? dissolve : 'Arial' }),
		requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
		cancelAnimationFrame: id => frames.delete(id),
		ResizeObserver: class {
			constructor(callback) { this.callback = callback; observers.push(this); }
			observe() {}
			disconnect() { this.disconnected = true; }
		},
	};
	for (const [name, value] of Object.entries(globals)) {
		const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
		Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
		t.after(() => {
			if (descriptor) Object.defineProperty(globalThis, name, descriptor);
			else delete globalThis[name];
		});
	}
	return {
		frames, listeners, observers, resolveFonts,
		get draws() { return draws; },
		setDissolve(value) { dissolve = value; },
		mount(reducedMotion) {
			return createContributionText({ clientWidth: 44 }, makeCanvas(), { lines: ['A'], columns: 4 }, reducedMotion);
		},
		flush(time) {
			const pending = [...frames.values()];
			frames.clear();
			for (const callback of pending) callback(time);
		},
	};
}

test('reduced motion paints once, redraws on resize and does not subscribe to motion events', t => {
	const env = createEnvironment(t);
	const dispose = env.mount(true);
	env.flush(0);
	assert.equal(env.draws, 1);
	assert.equal(env.frames.size, 0);
	assert.equal(env.listeners.size, 0);
	env.observers[0].callback();
	env.flush(16);
	assert.equal(env.draws, 2);
	assert.equal(env.frames.size, 0);
	dispose();
});

test('a stationary partial dissolve does not keep an animation loop running', t => {
	const env = createEnvironment(t);
	const dispose = env.mount(false);
	env.flush(0);
	env.flush(10_000);
	assert.equal(env.frames.size, 0);
	env.setDissolve('0.5');
	env.listeners.get('scroll')();
	env.flush(10_016);
	assert.equal(env.frames.size, 0);
	dispose();
});

test('cleanup cancels frames, disconnects observers and ignores fonts resolving after unmount', async t => {
	const env = createEnvironment(t);
	const dispose = env.mount(false);
	assert.equal(env.frames.size, 1);
	dispose();
	assert.equal(env.frames.size, 0);
	assert.equal(env.listeners.size, 0);
	assert.ok(env.observers.every(observer => observer.disconnected));
	env.resolveFonts();
	await Promise.resolve();
	assert.equal(env.frames.size, 0);
	assert.equal(env.draws, 0);
});
