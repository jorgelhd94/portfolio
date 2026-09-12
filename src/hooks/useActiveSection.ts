import { useEffect, useState } from 'react';
import type { NavLink } from '../data/site';

export function useActiveSection(links: NavLink[]) {
	const [current, setCurrent] = useState(links[0]?.href ?? '');
	useEffect(() => {
		let frame = 0;
		const update = () => {
			frame = 0;
			let active = links[0]?.href ?? '';
			for (const link of links) {
				if (!link.href.startsWith('#')) continue;
				const section = document.getElementById(link.href.slice(1));
				if (section && section.getBoundingClientRect().top <= window.innerHeight / 2) active = link.href;
			}
			setCurrent(active);
		};
		const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
		update();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);
		const observer = new ResizeObserver(schedule);
		observer.observe(document.body);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		};
	}, [links]);
	return current;
}
