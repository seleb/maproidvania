export function load(): Promise<string> {
	return new Promise<string>((r, reject) => {
		const input = document.createElement('input');
		input.type = 'file';

		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) return;

			// setting up the reader
			const reader = new FileReader();
			reader.readAsText(file, 'UTF-8');

			reader.onload = () => {
				r(reader.result?.toString() || '');
			};
			reader.onerror = reject;
		};

		input.click();
	});
}
