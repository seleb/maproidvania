import { flatten } from 'flat';

export async function save(data: unknown) {
	if (!('showSaveFilePicker' in window)) {
		throw new Error('browser does not support native file system access');
	}
	const options = {
		types: [
			{
				description: 'JSON',
				accept: {
					'application/json': ['.json'],
				},
			},
		],
	};
	const handle: FileSystemFileHandle = await window.showSaveFilePicker(options);
	const writable = await handle.createWritable();
	const a = Object.entries(flatten(data));
	await writable.write('[\n');
	for (let i of a) {
		await writable.write(JSON.stringify(i));
		if (i !== a[a.length - 1]) await writable.write(',\n');
	}
	await writable.write('\n]');
	await writable.close();
}
