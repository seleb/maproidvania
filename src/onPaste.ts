export function onPasteImage(callback: (image: string) => void) {
	document.addEventListener('paste', (event) => {
		const items = (event.clipboardData || event.originalEvent.clipboardData)
			.items;
		for (let index in items) {
			const item = items[index];
			if (item.kind === 'file') {
				const blob = item.getAsFile();
				const reader = new FileReader();
				reader.onload = () => {
					const result = reader.result as string | null;
					if (result?.startsWith('data:image')) callback(result);
				};
				reader.readAsDataURL(blob);
			}
		}
	});
}
