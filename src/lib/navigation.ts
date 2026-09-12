export function preventMissingSection(event: { preventDefault(): void }, href: string) {
	if (href.startsWith('#') && !document.getElementById(href.slice(1))) {
		event.preventDefault();
	}
}
