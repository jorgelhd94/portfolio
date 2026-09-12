import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef, useState } from 'react';
import { vertexShader, fragmentShader } from './light-rays/shaders';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Adapted from React Bits light-rays (MIT): https://reactbits.dev/backgrounds/light-rays

type RaysOrigin =
	| 'top-center'
	| 'top-left'
	| 'top-right'
	| 'right'
	| 'left'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

interface LightRaysProps {
	raysOrigin?: RaysOrigin;
	raysColor?: string;
	raysSpeed?: number;
	lightSpread?: number;
	rayLength?: number;
	pulsating?: boolean;
	fadeDistance?: number;
	saturation?: number;
	followMouse?: boolean;
	mouseInfluence?: number;
	noiseAmount?: number;
	distortion?: number;
	className?: string;
}

type Uniform<T> = { value: T };
type Vec2 = [number, number];

interface RayUniforms {
	iTime: Uniform<number>;
	iResolution: Uniform<Vec2>;
	rayPos: Uniform<Vec2>;
	rayDir: Uniform<Vec2>;
	raysColor: Uniform<[number, number, number]>;
	raysSpeed: Uniform<number>;
	lightSpread: Uniform<number>;
	rayLength: Uniform<number>;
	pulsating: Uniform<number>;
	fadeDistance: Uniform<number>;
	saturation: Uniform<number>;
	mousePos: Uniform<Vec2>;
	mouseInfluence: Uniform<number>;
	noiseAmount: Uniform<number>;
	distortion: Uniform<number>;
}

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex: string): [number, number, number] => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return m
		? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
		: [1, 1, 1];
};

const getAnchorAndDir = (
	origin: RaysOrigin,
	w: number,
	h: number
): { anchor: Vec2; dir: Vec2 } => {
	const outside = 0.2;
	switch (origin) {
		case 'top-left':
			return { anchor: [0, -outside * h], dir: [0, 1] };
		case 'top-right':
			return { anchor: [w, -outside * h], dir: [0, 1] };
		case 'left':
			return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
		case 'right':
			return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
		case 'bottom-left':
			return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
		case 'bottom-center':
			return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
		case 'bottom-right':
			return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
		default:
			return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
	}
};

const LightRays = ({
	raysOrigin = 'top-center',
	raysColor = DEFAULT_COLOR,
	raysSpeed = 1,
	lightSpread = 1,
	rayLength = 2,
	pulsating = false,
	fadeDistance = 1.0,
	saturation = 1.0,
	followMouse = true,
	mouseInfluence = 0.1,
	noiseAmount = 0.0,
	distortion = 0.0,
	className = '',
}: LightRaysProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const reducedMotion = useReducedMotion();

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0.1 }
		);
		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!isVisible || !container) return;

		let renderer: Renderer;
		try {
			renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
		} catch {
			return;
		}
		const gl = renderer.gl;
		const uniforms: RayUniforms = {
			iTime: { value: 0 },
			iResolution: { value: [1, 1] },
			rayPos: { value: [0, 0] },
			rayDir: { value: [0, 1] },
			raysColor: { value: hexToRgb(raysColor) },
			raysSpeed: { value: raysSpeed },
			lightSpread: { value: lightSpread },
			rayLength: { value: rayLength },
			pulsating: { value: pulsating ? 1 : 0 },
			fadeDistance: { value: fadeDistance },
			saturation: { value: saturation },
			mousePos: { value: [0.5, 0.5] },
			mouseInfluence: { value: followMouse ? mouseInfluence : 0 },
			noiseAmount: { value: noiseAmount },
			distortion: { value: distortion },
		};
		const geometry = new Triangle(gl);
		const program = new Program(gl, { vertex: vertexShader, fragment: fragmentShader, uniforms });
		const mesh = new Mesh(gl, { geometry, program });
		container.appendChild(gl.canvas);

		let frame = 0;
		const mouse = { x: 0.5, y: 0.5 };
		const draw = (time: number) => {
			uniforms.iTime.value = reducedMotion ? 0 : time * 0.001;
			const position = uniforms.mousePos.value;
			position[0] += (mouse.x - position[0]) * 0.08;
			position[1] += (mouse.y - position[1]) * 0.08;
			renderer.render({ scene: mesh });
		};
		const animate = (time: number) => {
			draw(time);
			frame = requestAnimationFrame(animate);
		};
		const resize = () => {
			const { clientWidth: width, clientHeight: height } = container;
			if (!width || !height) return;
			renderer.setSize(width, height);
			const resolution: Vec2 = [width * renderer.dpr, height * renderer.dpr];
			uniforms.iResolution.value = resolution;
			const { anchor, dir } = getAnchorAndDir(raysOrigin, ...resolution);
			uniforms.rayPos.value = anchor;
			uniforms.rayDir.value = dir;
			draw(performance.now());
		};
		const handleMouseMove = (event: MouseEvent) => {
			const rect = container.getBoundingClientRect();
			if (!rect.width || !rect.height) return;
			mouse.x = (event.clientX - rect.left) / rect.width;
			mouse.y = (event.clientY - rect.top) / rect.height;
		};
		const observer = new ResizeObserver(resize);
		observer.observe(container);
		resize();
		if (!reducedMotion) {
			frame = requestAnimationFrame(animate);
			if (followMouse) window.addEventListener('mousemove', handleMouseMove);
		}

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('mousemove', handleMouseMove);
			geometry.remove();
			program.remove();
			gl.canvas.remove();
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		};
	}, [isVisible, reducedMotion, raysOrigin, raysColor, raysSpeed, lightSpread, rayLength,
		pulsating, fadeDistance, saturation, followMouse, mouseInfluence, noiseAmount, distortion]);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{ width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}
		/>
	);
};

export default LightRays;
