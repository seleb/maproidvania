export async function save(data: string) {
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
