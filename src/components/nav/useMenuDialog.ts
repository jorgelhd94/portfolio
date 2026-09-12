import { useEffect, useRef, useState } from 'react';

export function useMenuDialog(open: boolean, reducedMotion: boolean) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const restoreOverflow = useRef<(() => void) | null>(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		let frame = 0;
		let timer = 0;
		const close = () => {
			dialog.close();
			restoreOverflow.current?.();
			restoreOverflow.current = null;
		};
		if (open) {
			if (!dialog.open) {
				const overflow = document.body.style.overflow;
				restoreOverflow.current = () => { document.body.style.overflow = overflow; };
				dialog.showModal();
				document.body.style.overflow = 'hidden';
			}
			if (reducedMotion) setVisible(true);
			else frame = requestAnimationFrame(() => {
				frame = requestAnimationFrame(() => setVisible(true));
			});
		} else {
			setVisible(false);
			if (reducedMotion) close();
			else timer = window.setTimeout(close, 500);
		}
		return () => {
			cancelAnimationFrame(frame);
			window.clearTimeout(timer);
		};
	}, [open, reducedMotion]);
	useEffect(() => () => {
		restoreOverflow.current?.();
		restoreOverflow.current = null;
	}, []);
	return { dialogRef, visible };
}
