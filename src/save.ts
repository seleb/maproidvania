export async function save(data: string) {
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
	const handle = await window.showSaveFilePicker(options);
	const writable = await handle.createWritable();
	await writable.write(data);
	await writable.close();
}
