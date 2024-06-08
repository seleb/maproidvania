import { unflatten } from 'flat';

export function load(): Promise<string> {
	return new Promise<string>((r, reject) => {
		const input = document.createElement('input');
		input.type = 'file';

		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) return r('');

			const reader = new FileReader();
			reader.onload = () => {
				const buffer = reader.result as ArrayBuffer;
				const decoder = new TextDecoder('utf-8');
				let string = '';
				const result = [];
				const stride = 100000;
				for (let i = 0; i < buffer.byteLength; i += stride) {
					string += decoder.decode(
						buffer.slice(i, Math.min(buffer.byteLength, i + stride))
					);
					while (string.includes(',\n')) {
						let [a, ...b] = string.split(',\n');
						string = b.join(',\n');
						a = a.replace(/^\[\n/, '');
						a = a.replace(/^\]/, '');
						if (a === '[' || a === ']') continue;
						result.push(JSON.parse(a));
					}
				}
				r(unflatten(Object.fromEntries(result)));
			};
			reader.onerror = (event) => {
				reject(event);
			};
			reader.readAsArrayBuffer(file);
		};

		input.click();
	});
}
