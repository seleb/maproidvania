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
	await writable.write(JSON.stringify(Object.entries(flatten(data))));
	await writable.close();
}
