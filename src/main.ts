import { get, set } from './Storage';
import { load } from './load';
import { error } from './logger';
import { onPasteImage } from './onPaste';
import { save } from './save';

(async () => {
	let current = get('current');
	let grid = get('grid');
	let areas = get('areas');
	let area = areas[current];

	let zoomEffective = 1;
	const updateZoomEffective = () => {
		zoomEffective = Math.pow(1.1, area.zoom);
	};

	const divControls = document.querySelector<HTMLDivElement>('#controls');
	const divMapContainer =
		document.querySelector<HTMLDivElement>('#map-container');
	const divMap = document.querySelector<HTMLDivElement>('#map');
	const layerImages = document.querySelector<HTMLDivElement>('#images');
	const layerDrawings = document.querySelector<HTMLDivElement>('#drawings');
	const layerPins = document.querySelector<HTMLDivElement>('#pins');
	const layerText = document.querySelector<HTMLDivElement>('#text');
	const divAbout = document.querySelector<HTMLDivElement>('#about');
	const divCursor = document.querySelector<HTMLDivElement>('#cursor');
	const btnAboutToggle =
		document.querySelector<HTMLButtonElement>('#btn-about');
	const selectAreas = document.querySelector<HTMLSelectElement>('#areas');
	const btnAreaAdd = document.querySelector<HTMLButtonElement>('#btn-area-add');
	const btnAreaRename =
		document.querySelector<HTMLButtonElement>('#btn-area-rename');
	const btnAreaDelete =
		document.querySelector<HTMLButtonElement>('#btn-area-delete');
	const btnGrid = document.querySelector<HTMLButtonElement>('#btn-grid');
	const btnSave = document.querySelector<HTMLButtonElement>('#btn-save');
	const btnExport = document.querySelector<HTMLButtonElement>('#btn-export');
	const btnImport = document.querySelector<HTMLButtonElement>('#btn-import');
	const btnSelect = document.querySelector<HTMLInputElement>('#btn-select');
	const btnPan = document.querySelector<HTMLInputElement>('#btn-pan');
	const btnText = document.querySelector<HTMLInputElement>('#btn-text');
	const btnColours = document.querySelectorAll<HTMLInputElement>(
		'#options-colour > *'
	);
	const btnPins = document.querySelectorAll<HTMLInputElement>(
		'#options-pin input[type="radio"]'
	);
	const btnCustomPin = document.querySelector<HTMLInputElement>('#custom-pin');
	const btnCustomPinEntry =
		document.querySelector<HTMLInputElement>('#custom-pin-entry');
	const divContext = document.querySelector<HTMLDivElement>('#context');
	const btnDelete =
		document.querySelector<HTMLButtonElement>('#context-delete');
	const textareaNotes =
		document.querySelector<HTMLTextAreaElement>('#context-notes');
	const ulImages = document.querySelector<HTMLUListElement>('#context-images');
	if (
		!divControls ||
		!divMapContainer ||
		!divMap ||
		!layerImages ||
		!layerDrawings ||
		!layerPins ||
		!layerText ||
		!divAbout ||
		!divCursor ||
		!btnSelect ||
		!btnPan ||
		!btnText ||
		!btnAboutToggle ||
		!selectAreas ||
		!btnAreaAdd ||
		!btnAreaRename ||
		!btnAreaDelete ||
		!btnGrid ||
		!btnSave ||
		!btnExport ||
		!btnImport ||
		!btnColours.length ||
		!btnPins.length ||
		!btnCustomPin ||
		!btnCustomPinEntry ||
		!divContext ||
		!btnDelete ||
		!textareaNotes ||
		!ulImages
	)
		throw new Error('Could not find elements');

	const loadArea = () => {
		// populate area select
		selectAreas.textContent = '';
		Object.keys(areas).forEach((i) => {
			const elOption = document.createElement('option');
			elOption.value = i;
			elOption.textContent = i;
			if (i === current) elOption.selected = true;
			selectAreas.appendChild(elOption);
		});

		// pins
		layerPins.textContent = '';
		area.pins.forEach((p, idx) => {
			const pin = p.type;
			const elPin = document.createElement('div');
			elPin.textContent = pin;
			elPin.style.top = `${p.y}px`;
			elPin.style.left = `${p.x}px`;
			layerPins.appendChild(elPin);
			elPin.dataset.idx = idx.toString(10);
		});

		// text
		layerText.textContent = '';
		area.text.forEach((p, idx) => {
			const elText = document.createElement('div');
			elText.contentEditable = 'plaintext-only';
			elText.style.top = `${p.y}px`;
			elText.style.left = `${p.x}px`;
			elText.textContent = p.text;
			elText.dataset.idx = idx.toString(10);
			layerText.appendChild(elText);
			elText.addEventListener('input', () => {
				area.text[parseInt(elText.dataset.idx || '', 10)].text =
					elText.textContent || '';
			});
			elText.addEventListener('blur', () => {
				if (!elText.textContent?.trim()) {
					area.text.splice(parseInt(elText.dataset.idx || '', 10), 1);
					updateIdxs(elText);
					elText.remove();
				}
			});
		});

		// display
		updateGrid();
		updateZoomEffective();
		updateMap();
	};

	btnAboutToggle.addEventListener('click', () => {
		divAbout.classList.toggle('show');
	});

	selectAreas.addEventListener('change', () => {
		current = selectAreas.value;
		area = areas[current];
		loadArea();
	});
	btnAreaAdd.addEventListener('click', () => {
		const key = window.prompt(
			'new area name?',
			`area ${Object.keys(areas).length}`
		);
		if (!key) return;
		if (areas[key]) {
			window.alert('error: an area with that name already exists!');
			return;
		}
		const elOption = document.createElement('option');
		elOption.value = key;
		elOption.textContent = key;
		selectAreas.appendChild(elOption);
		areas[key] = {
			offset: { x: 0, y: 0 },
			zoom: 1,
			images: {},
			drawings: [],
			pins: [],
			text: [],
		};
		selectAreas.value = key;
		selectAreas.dispatchEvent(new Event('change'));
	});
	btnAreaRename.addEventListener('click', () => {
		const key = window.prompt('rename area', current);
		if (!key) return;
		areas[key] = areas[current];
		delete areas[current];
		current = key;
		selectAreas.selectedOptions[0].value =
			selectAreas.selectedOptions[0].textContent = current;
	});
	btnAreaDelete.addEventListener('click', () => {
		if (Object.keys(areas).length <= 1) {
			window.alert('error: cannot delete only area!');
			return;
		}
		if (!window.confirm('delete area?')) return;
		delete areas[current];
		current = Object.keys(areas)[0];
		selectAreas.selectedOptions[0].remove();
		selectAreas.value = current;
		selectAreas.dispatchEvent(new Event('change'));
	});

	btnGrid.addEventListener('click', () => {
		const warning =
			'note: this is global and will misalign anything that has been already placed on the map';
		const w = window.prompt(
			`Set map cell width (${warning})`,
			grid[0].toString(10)
		);
		if (!w) return;
		const h = window.prompt(
			`Set map cell height (${warning})`,
			grid[1].toString(10)
		);
		if (!h) return;
		grid[0] = parseInt(w, 10);
		grid[1] = parseInt(h, 10);
		updateGrid();
	});

	btnSave.addEventListener('click', () => {
		set('grid', grid);
		set('current', current);
		set('areas', areas);
	});
	btnExport.addEventListener('click', async () => {
		try {
			const data = JSON.stringify({ grid, current, areas }, undefined, '\t');
			await save(data);
		} catch (err) {
			error(err);
			window.alert(`error: failed to export - ${err.message}`);
		}
	});
	btnImport.addEventListener('click', async () => {
		try {
			const data = await load();
			const content = JSON.parse(data);
			if (
				typeof content.current !== 'string' ||
				typeof content.areas !== 'object'
			)
				throw new Error('invalid file');
			current = content.current;
			areas = content.areas;
			area = areas[current];
			loadArea();
		} catch (err) {
			error(err);
			window.alert(`error: failed to import - ${err.message}`);
		}
	});

	btnColours.forEach((i) => {
		i.style.backgroundColor = i.value;
	});
	btnPins.forEach((i) => {
		const span = document.createElement('span');
		span.textContent = i.value || '';
		i.parentElement?.appendChild(span);
	});

	let tool = 'select';
	let toolOption = '';

	btnColours.forEach((i) => {
		i.addEventListener('change', () => {
			tool = 'draw';
			toolOption = i.value;
			divCursor.textContent = '';
			divCursor.className = 'draw';
			divMapContainer.style.cursor = 'crosshair';
		});
	});

	btnCustomPinEntry.addEventListener('input', () => {
		btnCustomPin.value = btnCustomPinEntry.value;
		btnCustomPin.nextElementSibling.textContent = btnCustomPin.value;
		btnCustomPin.disabled = !btnCustomPin.value.trim();
	});
	btnPins.forEach((i) => {
		i.addEventListener('change', () => {
			tool = 'pin';
			toolOption = i.value;
			divCursor.textContent = i.value;
			divCursor.className = 'pin';
			divMapContainer.style.cursor = 'none';
		});
	});
	btnSelect.addEventListener('change', () => {
		tool = 'select';
		toolOption = '';
		divCursor.textContent = '';
		divCursor.className = 'select';
		divMapContainer.style.cursor = 'auto';
	});
	btnPan.addEventListener('change', () => {
		tool = 'pan';
		toolOption = '';
		divCursor.textContent = '';
		divCursor.className = 'pan';
		divMapContainer.style.cursor = 'grab';
	});
	btnText.addEventListener('change', () => {
		tool = 'text';
		toolOption = '';
		divCursor.textContent = 'Type here...';
		divCursor.className = 'text';
		divMapContainer.style.cursor = 'text';
	});

	const startDrawing = (colour: string) => {
		function stopDrawing() {
			// todo
			// layerDrawings
		}
		// todo
		// layerDrawings
		window.addEventListener('pointerup', stopDrawing, { once: true });
	};

	const updateMap = () => {
		let z = zoomEffective;
		while (z > 4) {
			z /= 2;
		}
		while (z < 1) {
			z *= 2;
		}
		divMapContainer.style.backgroundSize = `${(grid[0] * z) / 4}px ${
			(grid[1] * z) / 4
		}px`;
		divMapContainer.style.backgroundPositionX = `${-area.offset.x}px`;
		divMapContainer.style.backgroundPositionY = `${-area.offset.y}px`;
		divMap.style.transform = `translate(${-area.offset.x}px, ${-area.offset
			.y}px) scale(${zoomEffective})`;
		document.querySelectorAll<HTMLDivElement>('#pins > *').forEach((i) => {
			i.style.transform = `translate(-50%, -50%) scale(${1 / zoomEffective})`;
		});
	};

	const updateGrid = () => {
		layerImages.textContent = '';
		const [minX, minY, maxX, maxY] = Object.keys(area.images).length
			? Object.keys(area.images)
					.map((i) => i.split('|').map((j) => parseInt(j, 10)))
					.reduce(
						([minX, minY, maxX, maxY], [x, y]) => [
							Math.min(minX, x),
							Math.min(minY, y),
							Math.max(maxX, x),
							Math.max(maxY, y),
						],
						[Infinity, Infinity, -Infinity, -Infinity]
					)
			: [0, 0, 0, 0];
		for (let y = minY - 1; y <= maxY + 1; ++y) {
			for (let x = minX - 1; x <= maxX + 1; ++x) {
				const img = area.images[`${x}|${y}`];
				const el = document.createElement(img ? 'img' : 'div');
				el.src = img;
				el.dataset.x = x.toString(10);
				el.dataset.y = y.toString(10);
				el.style.width = `${grid[0]}px`;
				el.style.height = `${grid[1]}px`;
				el.style.transform = `translate(${x * grid[0]}px, ${y * grid[1]}px)`;
				layerImages.appendChild(el);
			}
		}
	};

	const getPos = (x: number, y: number) => {
		return { x: x + area.offset.x, y: y + area.offset.y };
	};
	const getPosMouseScreen = () => {
		return {
			x: parseFloat(divCursor.style.left),
			y: parseFloat(divCursor.style.top),
		};
	};
	const getPosMouseMap = () => {
		const p = getPosMouseScreen();
		const p2 = getPos(p.x, p.y);
		p2.x /= zoomEffective;
		p2.y /= zoomEffective;
		return p2;
	};

	const startDragging = (event: PointerEvent) => {
		const current = { ...area.offset };
		const start = { x: event.clientX, y: event.clientY };
		const cursorOld = divMapContainer.style.cursor;
		divMapContainer.style.cursor = 'grabbing';
		const drag = (event: PointerEvent) => {
			area.offset.x = -(event.clientX - start.x) + current.x;
			area.offset.y = -(event.clientY - start.y) + current.y;
			if (selected) contextSelect(selected, selectedType);
			updateMap();
		};
		const stopDragging = () => {
			window.removeEventListener('pointermove', drag);
			divMapContainer.style.cursor = cursorOld;
		};
		window.addEventListener('pointermove', drag);
		window.addEventListener('pointerup', stopDragging, { once: true });
	};

	const startMoving = (
		event: PointerEvent,
		element: HTMLElement,
		update: (x: number, y: number) => void
	) => {
		const start = { x: event.clientX, y: event.clientY };
		const elStart = {
			x: parseInt(element.style.left, 10),
			y: parseInt(element.style.top, 10),
		};
		const cursorOld = divMapContainer.style.cursor;
		divMapContainer.style.cursor = 'move';
		const move = (event: PointerEvent) => {
			update(
				(event.clientX - start.x) / zoomEffective + elStart.x,
				(event.clientY - start.y) / zoomEffective + elStart.y
			);
		};
		const stopMoving = () => {
			window.removeEventListener('pointermove', move);
			divMapContainer.style.cursor = cursorOld;
		};
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', stopMoving, { once: true });
	};

	let selected: HTMLElement | null = null;
	let selectedType = '';
	const updateContextImages = () => {
		const el = selected;
		if (!el) return;
		const pin = area.pins[parseInt(el.dataset.idx || '', 10)];
		ulImages.textContent = '';
		const imgs = (pin.images?.split('|') || []).filter((i) => i);
		imgs.forEach((i) => {
			const elImg = document.createElement('img');
			elImg.src = i;
			elImg.draggable = false;
			const elLi = document.createElement('li');

			const btnOpen = document.createElement('button');
			btnOpen.title = 'open in new tab';
			btnOpen.textContent = '🔍';
			btnOpen.addEventListener('click', () => {
				window.open(i, '_blank');
			});

			const btnDelete = document.createElement('button');
			btnDelete.title = 'delete';
			btnDelete.textContent = '✖';
			btnDelete.addEventListener('click', () => {
				elLi.remove();
				pin.images = Array.from(ulImages.querySelectorAll('img'))
					.map((i) => i.src)
					.join('|');
				updateContextImages();
			});

			elLi.appendChild(btnOpen);
			elLi.appendChild(btnDelete);
			elLi.appendChild(elImg);

			ulImages.appendChild(elLi);
		});
		if (!imgs.length) {
			const elLi = document.createElement('li');
			elLi.textContent = 'paste to add image';
			elLi.className = 'null';
			ulImages.appendChild(elLi);
		}
	};
	const contextSelect = (el: HTMLElement, type: string) => {
		contextDeselect();
		selected = el;
		selectedType = type;
		if (type === 'pin') {
			const pin = area.pins[parseInt(selected.dataset.idx || '', 10)];
			divContext.classList.add('show');
			const r = selected.getBoundingClientRect();
			selected.classList.add('selected');
			textareaNotes.value = pin.notes || '';
			updateContextImages();
			divContext.style.top = `${
				r.bottom < divMapContainer.clientHeight / 2
					? r.bottom
					: r.top - divContext.clientHeight
			}px`;
			divContext.style.left = `${
				r.right < divMapContainer.clientWidth / 2
					? r.right
					: r.left - divContext.clientWidth
			}px`;
			requestAnimationFrame(() => {
				window.addEventListener(
					'pointerdown',
					(event) => {
						if (
							event.target &&
							![divContext, selected].includes(event.target) &&
							!(
								divContext.contains(event.target) ||
								!selected?.contains(event.target)
							)
						)
							contextDeselect();
					},
					{ once: true }
				);
			});
		} else if (type === 'image') {
			selected.classList.add('selected');
		}
	};
	const contextDeselect = () => {
		divContext.classList.remove('show');
		selected?.classList.remove('selected');
		selected = null;
	};

	const updateIdxs = (el: HTMLElement) => {
		let next = el.nextSibling as HTMLElement | null;
		while (next) {
			next.dataset.idx = (parseInt(next.dataset.idx || '', 10) - 1).toString(
				10
			);
			next = next.nextSibling as HTMLElement | null;
		}
	};

	btnDelete.addEventListener('click', () => {
		if (!selected) return;
		const el = selected;
		const idx = parseInt(selected.dataset.idx || '', 10);
		area.pins.splice(idx, 1);
		updateIdxs(el);
		contextDeselect();
		el.remove();
	});
	textareaNotes.addEventListener('input', () => {
		if (!selected) return;
		const pin = area.pins[parseInt(selected.dataset.idx || '', 10)];
		pin.notes = textareaNotes.value;
	});

	divMapContainer.addEventListener('pointerdown', (event) => {
		const active = document.activeElement as HTMLElement | null;
		if (divControls.contains(active)) active?.blur();
		if (event.button === 1) {
			event.preventDefault();
			startDragging(event);
			return;
		} else if (event.button === 0) {
			if (tool === 'select') {
				contextDeselect();
				const element = document.elementFromPoint(
					event.clientX,
					event.clientY
				) as HTMLElement | null;
				if (element?.closest('#pins')) {
					active?.blur();
					event.preventDefault();
					contextSelect(element, 'pin');
					const pin = area.pins[parseInt(element.dataset.idx || '', 10)];
					startMoving(event, element, (x, y) => {
						element.style.left = `${x}px`;
						element.style.top = `${y}px`;
						pin.x = x;
						pin.y = y;
						contextSelect(element, 'pin');
					});
				} else if (element?.closest('#images')) {
					active?.blur();
					event.preventDefault();
					contextSelect(element, 'image');
				}
				return;
			} else if (tool === 'pan') {
				event.preventDefault();
				startDragging(event);
			} else if (tool === 'pin') {
				event.preventDefault();
				const pin = toolOption;
				const elPin = document.createElement('div');
				elPin.textContent = pin;
				const p = getPosMouseMap();
				elPin.style.top = `${p.y}px`;
				elPin.style.left = `${p.x}px`;
				layerPins.appendChild(elPin);
				elPin.dataset.idx = area.pins.length.toString(10);
				area.pins.push({
					x: p.x,
					y: p.y,
					type: toolOption,
					notes: '',
					images: '',
				});
				updateMap();
				btnSelect.click();
				contextSelect(elPin, 'pin');
			} else if (tool === 'colour') {
				event.preventDefault();
				const colour = toolOption;
				startDrawing(colour);
			} else if (tool === 'text') {
				event.preventDefault();
				const elText = document.createElement('div');
				elText.contentEditable = 'plaintext-only';
				const p = getPosMouseMap();
				elText.style.top = `${p.y}px`;
				elText.style.left = `${p.x}px`;
				layerText.appendChild(elText);
				elText.dataset.idx = area.text.length.toString(10);
				area.text.push({
					x: p.x,
					y: p.y,
					text: '',
				});
				updateMap();
				btnSelect.click();
				elText.focus();

				elText.addEventListener('input', () => {
					area.text[parseInt(elText.dataset.idx || '', 10)].text =
						elText.textContent || '';
				});
				elText.addEventListener('blur', () => {
					if (!elText.textContent?.trim()) {
						area.text.splice(parseInt(elText.dataset.idx || '', 10), 1);
						updateIdxs(elText);
						elText.remove();
					}
				});
			}
		}
	});

	// sync mouse
	divMapContainer.addEventListener('pointermove', (event) => {
		divCursor.style.left = `${event.clientX}px`;
		divCursor.style.top = `${event.clientY}px`;
	});

	const addImageNote = (img: string) => {
		if (!selected) return;
		const pin = area.pins[parseInt(selected.dataset.idx || '', 10)];
		pin.images = [pin.images, img].filter((i) => i).join('|');
		updateContextImages();
	};

	const addImage = (img: string) => {
		if (!selected) return;
		const key = `${selected.dataset.x}|${selected.dataset.y}`;
		area.images[key] = img;
		updateGrid();
	};

	// paste to add image
	onPasteImage((img: string) => {
		if (selected && selectedType === 'pin') {
			addImageNote(img);
		} else if (selected && selectedType === 'image') {
			addImage(img);
		}
	});

	let panning = false;
	window.addEventListener('keydown', (event) => {
		// ignore key events while typing
		if (
			document.activeElement?.tagName === 'TEXTAREA' ||
			document.activeElement?.tagName === 'INPUT'
		) {
			return;
		}
		// escape deselect
		if (event.key === 'Escape') {
			contextDeselect();
		}
		// delete image
		if (
			(event.key === 'Backspace' || event.key === 'Delete') &&
			selected &&
			selectedType === 'image'
		) {
			delete area.images[`${selected.dataset.x}|${selected.dataset.y}`];
			updateGrid();
		}
		// delete pin
		if (
			(event.key === 'Backspace' || event.key === 'Delete') &&
			selected &&
			selectedType === 'pin'
		) {
			btnDelete.click();
		}
		// ctrl+s to save
		if (event.ctrlKey && event.key === 's') {
			event.preventDefault();
			btnSave.click();
			return;
		}
		// ctrl+c to copy image
		if (
			event.ctrlKey &&
			event.key === 'c' &&
			selected &&
			selectedType === 'image'
		) {
			event.preventDefault();
			navigator.clipboard.writeText((selected as HTMLImageElement).src);
			return;
		}

		// hold space to pan
		if (!panning && event.key === ' ') {
			panning = true;
			const oldTool = tool;
			const oldToolOption = toolOption;
			btnPan.click();
			window.addEventListener('keyup', (event) => {
				if (event.key !== ' ') return;
				panning = false;
				document
					.querySelector<HTMLInputElement>(
						`input[name="tool"][value="${oldToolOption}"], input[name="tool"][value="${oldTool}"]`
					)
					?.click();
			});
		}
	});

	const focus = (x: number, y: number) => {
		area.offset.x = x - window.innerWidth / 2 / zoomEffective;
		area.offset.y = y - window.innerHeight / 2 / zoomEffective;
		updateMap();
	};

	// zoom in/out
	divMapContainer.addEventListener('wheel', (event) => {
		area.offset.x += event.deltaX;

		area.zoom -= Math.sign(event.deltaY);
		const zoomEffectiveOld = zoomEffective;
		updateZoomEffective();

		const zoomEffectiveChange = zoomEffective - zoomEffectiveOld;
		const mouse = getPosMouseScreen();
		const zoomPoint = {
			x: (mouse.x + area.offset.x) / zoomEffectiveOld,
			y: (mouse.y + area.offset.y) / zoomEffectiveOld,
		};
		area.offset.x += zoomPoint.x * zoomEffectiveChange;
		area.offset.y += zoomPoint.y * zoomEffectiveChange;

		if (selected) contextSelect(selected, selectedType);
		updateMap();
	});

	loadArea();
})();
