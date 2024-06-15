import { Search } from 'js-search';
import simplify from 'simplify-path';
import { Area, get, reset, set } from './Storage';
import { dirty } from './dirty';
import { getPath, updatePath } from './drawing';
import { highlight } from './highlight';
import { load } from './load';
import { error } from './logger';
import { onPasteImage } from './onPaste';
import { save } from './save';
import { pushUndoRedo, redo, undo } from './undo-redo';

(async () => {
	let current = get('current');
	let grid = get('grid');
	let areas = get('areas');
	let area: Area;

	let zoomEffective = 1;
	const updateZoomEffective = () => {
		zoomEffective = Math.pow(1.1, area.zoom);
	};

	const divOverlay = document.querySelector<HTMLDivElement>('#overlay');
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
	const divPing = document.querySelector<HTMLDivElement>('#ping');
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
	const btnNew = document.querySelector<HTMLButtonElement>('#btn-new');
	const btnSelect = document.querySelector<HTMLInputElement>('#btn-select');
	const btnPan = document.querySelector<HTMLInputElement>('#btn-pan');
	const btnText = document.querySelector<HTMLInputElement>('#btn-text');
	const btnColours = document.querySelectorAll<HTMLInputElement>(
		'#options-colour > input[type="radio"]'
	);
	const rangeStroke = document.querySelector<HTMLInputElement>('#stroke');
	const btnPins = document.querySelectorAll<HTMLInputElement>(
		'#options-pin input[type="radio"]'
	);
	const btnCustomPin = document.querySelector<HTMLInputElement>('#custom-pin');
	const btnCustomPinEntry =
		document.querySelector<HTMLInputElement>('#custom-pin-entry');
	const divContext = document.querySelector<HTMLDivElement>('#context');
	const btnDelete =
		document.querySelector<HTMLButtonElement>('#context-delete');
	const inputPinType = document.querySelector<HTMLInputElement>('#context-pin');
	const datalistPinType =
		document.querySelector<HTMLDataListElement>('#context-datalist');
	const textareaNotes =
		document.querySelector<HTMLTextAreaElement>('#context-notes');
	const ulImages = document.querySelector<HTMLUListElement>('#context-images');
	const inputSearch = document.querySelector<HTMLInputElement>('#search');
	const ulSearch = document.querySelector<HTMLUListElement>('#search-results');
	const ulToasts = document.querySelector<HTMLUListElement>('#toasts');
	if (
		!divOverlay ||
		!divControls ||
		!divMapContainer ||
		!divMap ||
		!layerImages ||
		!layerDrawings ||
		!layerPins ||
		!layerText ||
		!divAbout ||
		!divCursor ||
		!divPing ||
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
		!btnNew ||
		!btnColours.length ||
		!rangeStroke ||
		!btnPins.length ||
		!btnCustomPin ||
		!btnCustomPinEntry ||
		!divContext ||
		!btnDelete ||
		!datalistPinType ||
		!inputPinType ||
		!textareaNotes ||
		!ulImages ||
		!inputSearch ||
		!ulSearch ||
		!ulToasts
	)
		throw new Error('Could not find elements');

	const pause = (message: string) => {
		divOverlay.textContent = message;
		divOverlay.classList.add('show');
	};

	const unpause = () => {
		divOverlay.textContent = '';
		divOverlay.classList.remove('show');
	};

	const toast = (text: string) => {
		const li = document.createElement('li');
		li.textContent = text;
		ulToasts.appendChild(li);
		setTimeout(() => {
			li.remove();
		}, 2500);
	};

	const setArea = (key: string) => {
		current = key;
		area = areas[key];
		selectAreas.value = key;
		contextDeselect();
		loadArea();
	};

	const updateAreaSelect = () => {
		selectAreas.textContent = '';
		Object.keys(areas)
			.sort()
			.forEach((i) => {
				const elOption = document.createElement('option');
				elOption.value = i;
				elOption.textContent = i;
				if (i === current) elOption.selected = true;
				selectAreas.appendChild(elOption);
			});
	};

	const updatePinsScale = () => {
		document.querySelectorAll<HTMLDivElement>('#pins > *').forEach((i) => {
			i.style.transform = `translate(-50%, -50%) scale(${1 / zoomEffective})`;
		});
	};
	const updatePins = () => {
		layerPins.textContent = '';
		area.pins.forEach((p, idx) => {
			const pin = p.type;
			const elPin = document.createElement('div');
			elPin.textContent = pin || '???';
			elPin.style.top = `${p.y}px`;
			elPin.style.left = `${p.x}px`;
			layerPins.appendChild(elPin);
			elPin.dataset.idx = idx.toString(10);
		});
		updatePinsScale();
	};

	const loadArea = () => {
		updateAreaSelect();
		updatePins();

		// text
		layerText.textContent = '';
		area.text.forEach((p, idx) => {
			const elText = document.createElement('div');
			try {
				elText.contentEditable = 'plaintext-only';
			} catch {
				elText.contentEditable = 'true';
			}
			elText.style.top = `${p.y}px`;
			elText.style.left = `${p.x}px`;
			elText.style.fontSize = `${p.size * 100}%`;
			elText.textContent = p.text;
			elText.dataset.idx = idx.toString(10);
			layerText.appendChild(elText);
			elText.addEventListener('input', () => {
				area.text[parseInt(elText.dataset.idx || '', 10)].text =
					elText.textContent || '';
				dirty();
			});
			elText.addEventListener('blur', () => {
				if (!elText.textContent?.trim()) {
					area.text.splice(parseInt(elText.dataset.idx || '', 10), 1);
					updateIdxs(elText);
					elText.remove();
					dirty();
				}
			});
		});

		// display
		updateDrawings();
		updateGrid();
		updateZoomEffective();
		updateMap();
	};

	btnAboutToggle.addEventListener('click', () => {
		divAbout.classList.toggle('show');
	});

	selectAreas.addEventListener('change', () => {
		const areaOld = current;
		const areaNew = selectAreas.value;
		if (areaOld === areaNew) return;
		pushUndoRedo({
			name: 'change area',
			undo() {
				setArea(areaOld);
			},
			redo() {
				setArea(areaNew);
			},
		});
	});
	btnAreaAdd.addEventListener('click', () => {
		const areaNew = window.prompt(
			'new area name?',
			`area ${Object.keys(areas).length}`
		);
		if (!areaNew) return;
		if (areas[areaNew]) {
			window.alert('error: an area with that name already exists!');
			return;
		}
		const areaOld = current;
		const areaObj = {
			offset: { x: 0, y: 0 },
			zoom: 1,
			images: {},
			drawings: [],
			pins: [],
			text: [],
		};
		pushUndoRedo({
			name: 'create area',
			undo() {
				delete areas[areaNew];
				updateAreaSelect();
				setArea(areaOld);
				dirty();
			},
			redo() {
				areas[areaNew] = areaObj;
				updateAreaSelect();
				setArea(areaNew);
				dirty();
			},
		});
	});
	btnAreaRename.addEventListener('click', () => {
		const areaOld = current;
		const areaNew = window.prompt('rename area', current);
		if (!areaNew || areaNew === areaOld) return;

		pushUndoRedo({
			name: 'rename area',
			undo() {
				areas[areaOld] = areas[areaNew];
				delete areas[areaNew];
				current = areaOld;
				selectAreas.selectedOptions[0].value =
					selectAreas.selectedOptions[0].textContent = areaOld;
				dirty();
			},
			redo() {
				areas[areaNew] = areas[areaOld];
				delete areas[areaOld];
				current = areaNew;
				selectAreas.selectedOptions[0].value =
					selectAreas.selectedOptions[0].textContent = areaNew;
				dirty();
			},
		});
	});
	btnAreaDelete.addEventListener('click', () => {
		const areaOld = current;
		if (Object.keys(areas).length <= 1) {
			window.alert('error: cannot delete only area!');
			return;
		}
		if (!window.confirm('delete area?')) return;
		const areaNew = Object.keys(areas).filter((i) => i !== areaOld)[0];
		const areaObj = areas[areaOld];
		const elOption = selectAreas.selectedOptions[0];
		const idxOption = selectAreas.selectedIndex;

		pushUndoRedo({
			name: 'delete area',
			undo() {
				areas[areaOld] = areaObj;
				selectAreas.insertBefore(elOption, selectAreas.children[idxOption]);
				setArea(areaOld);
				dirty();
			},
			redo() {
				delete areas[areaOld];
				elOption.remove();
				setArea(areaNew);
				dirty();
			},
		});
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
		const wOld = grid[0];
		const hOld = grid[1];
		const wNew = parseInt(w, 10);
		const hNew = parseInt(h, 10);

		pushUndoRedo({
			name: 'resize grid',
			undo() {
				grid[0] = wOld;
				grid[1] = hOld;
				updateGrid();
				dirty();
			},
			redo() {
				grid[0] = wNew;
				grid[1] = hNew;
				updateGrid();
				dirty();
			},
		});
	});

	btnSave.addEventListener('click', async () => {
		pause('saving...');
		try {
			await set('grid', grid);
			await set('current', current);
			await set('areas', areas);
			toast('saved');
			dirty(false);
		} finally {
			unpause();
		}
	});
	btnExport.addEventListener('click', async () => {
		pause('exporting...');
		try {
			await save({ grid, current, areas });
			toast('exported');
			dirty(false);
		} catch (err) {
			error(err);
			window.alert(`error: failed to export - ${err.message}`);
		} finally {
			unpause();
		}
	});
	btnImport.addEventListener('click', async () => {
		pause('importing...');
		try {
			const content = await load();
			if (!content) return;
			if (
				typeof content.current !== 'string' ||
				typeof content.areas !== 'object'
			)
				throw new Error('invalid file');
			const gridOld = grid;
			const gridNew = content.grid;
			const areasOld = areas;
			const areasNew = content.areas;
			const areaOld = current;
			const areaNew = content.current;
			toast('imported');

			pushUndoRedo({
				name: 'import',
				undo() {
					grid = gridOld;
					areas = areasOld;
					setArea(areaOld);
					dirty();
				},
				redo() {
					grid = gridNew;
					areas = areasNew;
					setArea(areaNew);
					dirty();
				},
			});
		} catch (err) {
			error(err);
			window.alert(`error: failed to import - ${err.message}`);
		} finally {
			unpause();
		}
	});
	btnNew.addEventListener('click', async () => {
		const yeah = confirm(
			"Create a new map?\nThis will clear the one currently saved in your browser, make sure to export a save file if you don't want to lose any data!"
		);
		if (!yeah) return;
		try {
			pause('resetting...');
			const gridOld = grid;
			const areasOld = areas;
			const areaOld = current;
			await reset();
			const gridNew = get('grid');
			const areasNew = get('areas');
			const areaNew = get('current');
			toast('reset');

			pushUndoRedo({
				name: 'reset',
				undo() {
					grid = gridOld;
					areas = areasOld;
					setArea(areaOld);
					dirty();
				},
				redo() {
					grid = gridNew;
					areas = areasNew;
					setArea(areaNew);
					dirty();
				},
			});
		} catch (err) {
			error(err);
			window.alert(`error: failed to reset - ${err.message}`);
		} finally {
			unpause();
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
	let lastColour = Array.from(btnColours)[0].value;
	let lastPin = Array.from(btnPins)[0].value;
	const setTool = (newTool: string, newToolOption = '', updateUi = true) => {
		tool = newTool;
		toolOption = newToolOption;
		if (tool === 'select') {
			divCursor.textContent = '';
			divCursor.className = 'select';
			divMapContainer.style.cursor = 'auto';
		} else if (tool === 'pan') {
			divCursor.textContent = '';
			divCursor.className = 'pan';
			divMapContainer.style.cursor = 'grab';
		} else if (tool === 'text') {
			divCursor.textContent = 'Type here...';
			divCursor.className = 'text';
			divMapContainer.style.cursor = 'text';
		} else if (tool === 'pin') {
			lastPin = toolOption;
			divCursor.textContent = toolOption;
			divCursor.className = 'pin';
			divMapContainer.style.cursor = 'none';
		} else if (tool === 'draw') {
			lastColour = toolOption;
			divCursor.style.setProperty('--colour', toolOption);
			divCursor.textContent = '';
			divCursor.className = 'draw';
			divMapContainer.style.cursor = 'crosshair';
		}
		if (updateUi) {
			document
				.querySelector<HTMLInputElement>(
					`input[type="radio"][name="tool"][value="${toolOption || tool}"]`
				)
				?.click();
		}
	};

	btnColours.forEach((i) => {
		i.addEventListener('change', () => {
			setTool('draw', i.value, false);
		});
	});

	btnCustomPinEntry.addEventListener('input', () => {
		btnCustomPin.value = btnCustomPinEntry.value;
		btnCustomPin.nextElementSibling.textContent = btnCustomPin.value;
		btnCustomPin.disabled = !btnCustomPin.value.trim();
	});
	btnPins.forEach((i) => {
		i.addEventListener('change', () => {
			setTool('pin', i.value, false);
		});
	});
	btnSelect.addEventListener('change', () => {
		setTool('select', undefined, false);
	});
	btnPan.addEventListener('change', () => {
		setTool('pan', undefined, false);
	});
	btnText.addEventListener('change', () => {
		setTool('text', undefined, false);
	});

	const updateBrushSize = () => {
		divCursor.style.setProperty(
			'--size',
			`${parseInt(rangeStroke.value, 10)}px`
		);
	};
	rangeStroke.addEventListener('input', updateBrushSize);

	const ping = (x: number, y: number) => {
		divPing.style.left = `${x}px`;
		divPing.style.top = `${y}px`;
		divPing.classList.remove('show');
		document.body.offsetHeight; // force reflow
		divPing.classList.add('show');
	};

	const startDrawing = (event: PointerEvent, colour: string) => {
		const size = parseFloat(rangeStroke.value) / (zoomEffective * 2);
		const path = getPath({ points: [], colour, size });
		layerDrawings.appendChild(path);
		let points: [number, number][] = [];

		const throttle = 10;
		let last = 0;
		const draw = (event: PointerEvent) => {
			const now = Date.now();
			const p = getPos(event.clientX, event.clientY);
			p.x /= zoomEffective;
			p.y /= zoomEffective;
			if (now - last < throttle) {
				points[points.length - 1][0] = p.x;
				points[points.length - 1][1] = p.y;
			} else {
				last = now;
				points = simplify(points, 2 / zoomEffective);
				points.push([p.x, p.y]);
			}
			updatePath(path, points, size);
		};
		draw(event);
		const stopDrawing = () => {
			window.removeEventListener('pointermove', draw);
			updatePath(path, points, size);
			const drawing = {
				points,
				size,
				colour,
			};

			pushUndoRedo({
				name: 'draw',
				undo() {
					area.drawings.pop();
					updateDrawings();
					dirty();
				},
				redo() {
					area.drawings.push(drawing);
					updateDrawings();
					dirty();
				},
			});
		};
		window.addEventListener('pointermove', draw);
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
		updatePinsScale();
	};

	const updateDrawings = () => {
		layerDrawings.textContent = '';
		area.drawings.forEach((i) => {
			layerDrawings.appendChild(getPath(i));
		});
	};

	const getMapBounds = () =>
		Object.keys(area.images).length
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

	const updateGrid = () => {
		layerImages.textContent = '';
		const [minX, minY, maxX, maxY] = getMapBounds();
		for (let y = minY - 1; y <= maxY + 1; ++y) {
			for (let x = minX - 1; x <= maxX + 1; ++x) {
				const img = area.images[`${x}|${y}`];
				const el = document.createElement(img ? 'img' : 'div');
				el.src = img;
				el.draggable = false;
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
			const elEnd = {
				x: parseInt(element.style.left, 10),
				y: parseInt(element.style.top, 10),
			};

			if (elEnd.x !== elStart.x || elEnd.y !== elStart.y) {
				pushUndoRedo({
					name: 'move',
					undo() {
						update(elStart.x, elStart.y);
						dirty();
					},
					redo() {
						update(elEnd.x, elEnd.y);
						dirty();
					},
				});
			}
		};
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', stopMoving, { once: true });
	};

	let selected: HTMLElement | null = null;
	let selectedType = '';
	const updateContextImages = (el: HTMLElement) => {
		if (el !== selected) return;
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
				const imagesOld = pin.images;
				const imagesNew = Array.from(ulImages.querySelectorAll('img'))
					.map((i) => i.src)
					.join('|');

				pushUndoRedo({
					name: 'delete image in pin',
					undo() {
						pin.images = imagesOld;
						updateContextImages(el);
						dirty();
					},
					redo() {
						pin.images = imagesNew;
						updateContextImages(el);
						dirty();
					},
				});
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
			inputPinType.value = pin.type || '???';
			textareaNotes.value = pin.notes || '';
			updateContextImages(el);
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
		} else if (type === 'drawing') {
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
		const idx = parseInt(selected.dataset.idx || '', 10);
		const pin = area.pins[idx];

		pushUndoRedo({
			name: 'delete pin',
			undo() {
				area.pins.splice(idx, 0, pin);
				updatePins();
				contextSelect(layerPins.children[idx], 'pin');
				dirty();
			},
			redo() {
				area.pins.splice(idx, 1);
				updatePins();
				contextDeselect();
				dirty();
			},
		});
	});
	inputPinType.addEventListener('input', () => {
		if (!selected) return;
		const pin = area.pins[parseInt(selected.dataset.idx || '', 10)];
		pin.type = inputPinType.value || '???';
		selected.textContent = pin.type;
		dirty();
	});
	textareaNotes.addEventListener('input', () => {
		if (!selected) return;
		const pin = area.pins[parseInt(selected.dataset.idx || '', 10)];
		pin.notes = textareaNotes.value;
		dirty();
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
				} else if (element?.closest('#drawings')) {
					active?.blur();
					event.preventDefault();
					contextSelect(element, 'drawing');
				}
				return;
			} else if (tool === 'pan') {
				event.preventDefault();
				startDragging(event);
			} else if (tool === 'pin') {
				event.preventDefault();
				const pinType = toolOption;
				const elPin = document.createElement('div');
				elPin.textContent = pinType;
				const p = getPosMouseMap();
				elPin.style.top = `${p.y}px`;
				elPin.style.left = `${p.x}px`;
				elPin.dataset.idx = area.pins.length.toString(10);
				btnSelect.click();
				const pinObj = {
					x: p.x,
					y: p.y,
					type: pinType,
					notes: '',
					images: '',
				};

				pushUndoRedo({
					name: 'place pin',
					undo() {
						contextDeselect();
						area.pins.pop();
						elPin.remove();
						updateMap();
						dirty();
					},
					redo() {
						layerPins.appendChild(elPin);
						area.pins.push(pinObj);
						updateMap();
						contextSelect(elPin, 'pin');
						dirty();
					},
				});
			} else if (tool === 'draw') {
				event.preventDefault();
				const colour = toolOption;
				startDrawing(event, colour);
			} else if (tool === 'text') {
				event.preventDefault();
				const elText = document.createElement('div');
				try {
					elText.contentEditable = 'plaintext-only';
				} catch {
					elText.contentEditable = 'true';
				}
				const p = getPosMouseMap();
				elText.style.top = `${p.y}px`;
				elText.style.left = `${p.x}px`;
				elText.style.fontSize = `200%`;
				elText.dataset.idx = area.text.length.toString(10);
				btnSelect.click();

				elText.addEventListener('input', () => {
					area.text[parseInt(elText.dataset.idx || '', 10)].text =
						elText.textContent || '';
					dirty();
				});
				elText.addEventListener('blur', () => {
					if (!elText.textContent?.trim()) {
						area.text.splice(parseInt(elText.dataset.idx || '', 10), 1);
						updateIdxs(elText);
						elText.remove();
						dirty();
					}
				});
				const textObj = {
					x: p.x,
					y: p.y,
					text: '',
					size: 2,
				};

				pushUndoRedo({
					name: 'place text',
					undo() {
						elText.remove();
						area.text.pop();
						dirty();
					},
					redo() {
						layerText.appendChild(elText);
						area.text.push(textObj);
						elText.focus();
						dirty();
					},
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
		const el = selected;
		if (!el) return;
		const pin = area.pins[parseInt(el.dataset.idx || '', 10)];
		const imagesOld = pin.images;
		const imagesNew = [pin.images, img].filter((i) => i).join('|');

		pushUndoRedo({
			name: 'add image to pin',
			undo() {
				pin.images = imagesOld;
				updateContextImages(el);
				dirty();
			},
			redo() {
				pin.images = imagesNew;
				updateContextImages(el);
				dirty();
			},
		});
	};

	const addImage = (img: string) => {
		if (!selected) return;
		const key = `${selected.dataset.x}|${selected.dataset.y}`;
		const imgOld = area.images[key];

		pushUndoRedo({
			name: 'place image',
			undo() {
				if (imgOld) area.images[key] = imgOld;
				else delete area.images[key];
				updateGrid();
				dirty();
			},
			redo() {
				area.images[key] = img;
				updateGrid();
				dirty();
			},
		});
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
		const active = document.activeElement as HTMLElement | null;
		// ignore most key events while typing
		if (
			active?.tagName === 'TEXTAREA' ||
			active?.tagName === 'INPUT' ||
			active?.contentEditable === 'plaintext-only' ||
			active?.contentEditable === 'true'
		) {
			// ctrl+(-/=) to change text size
			if (
				event.ctrlKey &&
				event.key === '=' &&
				active.parentElement === layerText
			) {
				event.preventDefault();
				const text = area.text[parseInt(active.dataset.idx || '', 10)];
				text.size *= 2;
				active.style.fontSize = `${text.size * 100}%`;
				dirty();
			} else if (
				event.ctrlKey &&
				event.key === '-' &&
				active.parentElement === layerText
			) {
				event.preventDefault();
				const text = area.text[parseInt(active.dataset.idx || '', 10)];
				text.size /= 2;
				active.style.fontSize = `${text.size * 100}%`;
				dirty();
			}
			return;
		}
		// undo
		if (event.ctrlKey && event.key === 'z') {
			const a = undo();
			if (a !== false) toast(['undo', a].filter((i) => i).join(' - '));
		}
		// redo
		if (
			(event.ctrlKey && event.key === 'y') ||
			(event.ctrlKey && event.shiftKey && event.key === 'z')
		) {
			const a = redo();
			if (a !== false) toast(['redo', a].filter((i) => i).join(' - '));
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
			const key = `${selected.dataset.x}|${selected.dataset.y}`;
			const img = area.images[key];

			pushUndoRedo({
				name: 'delete image',
				undo() {
					area.images[key] = img;
					updateGrid();
					dirty();
				},
				redo() {
					delete area.images[key];
					updateGrid();
					dirty();
				},
			});
		}
		// delete drawing
		if (
			(event.key === 'Backspace' || event.key === 'Delete') &&
			selected &&
			selectedType === 'drawing'
		) {
			const idx = Array.from(selected.parentElement?.children || []).indexOf(
				selected
			);
			const drawing = area.drawings[idx];

			pushUndoRedo({
				name: 'delete drawing',
				undo() {
					area.drawings.splice(idx, 0, drawing);
					updateDrawings();
					dirty();
				},
				redo() {
					area.drawings.splice(idx, 1);
					updateDrawings();
					dirty();
				},
			});
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
			setTool('pan');
			window.addEventListener('keyup', (event) => {
				if (event.key !== ' ') return;
				panning = false;
				setTool(oldTool, oldToolOption);
			});
		}

		// q for select
		if (event.key === 'q') {
			event.preventDefault();
			setTool('select');
			return;
		}
		// t for text
		if (event.key === 't') {
			event.preventDefault();
			setTool('text');
			return;
		}
		// b for drawing
		if (event.key === 'b') {
			event.preventDefault();
			setTool('draw', lastColour);
			return;
		}
		// p for pin
		if (event.key === 'p') {
			event.preventDefault();
			setTool('pin', lastPin);
			return;
		}
		// f to center + zoom to roughly fit map
		if (event.key === 'f') {
			event.preventDefault();
			const [minX, minY, maxX, maxY] = getMapBounds();
			const targetZoom =
				1 / (Math.max(Math.abs(maxX - minX), Math.abs(maxY - minY)) + 2);
			area.zoom = 1;
			updateZoomEffective();
			while (zoomEffective > targetZoom && area.zoom > -100) {
				--area.zoom;
				updateZoomEffective();
			}
			focus(
				((minX + maxX) / 2 + 0.5) * grid[0],
				((minY + maxY) / 2 + 0.5) * grid[1]
			);
			return;
		}
	});

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

		updateMap();
		if (selected) contextSelect(selected, selectedType);
	});

	// search
	const focus = (x: number, y: number) => {
		let tx = 0;
		let ty = 0;
		if (
			divControls.clientWidth / divMapContainer.clientWidth <
			divControls.clientHeight / divMapContainer.clientHeight
		) {
			tx = divControls.clientWidth / 2;
		} else {
			ty = divControls.clientHeight / 2;
		}
		area.offset.x = x * zoomEffective - divMapContainer.clientWidth / 2 - tx;
		area.offset.y = y * zoomEffective - divMapContainer.clientHeight / 2 - ty;
		ping(
			divMapContainer.clientWidth / 2 + tx,
			divMapContainer.clientHeight / 2 + ty
		);
		updateMap();
	};
	let search: Search;
	type SearchItem = {
		key: string;
		area: string;
		text: string;
		original: ((typeof area)['pins'] | (typeof area)['text'])[number];
	};
	inputSearch.addEventListener('focus', () => {
		search = new Search('key');
		search.addDocuments(
			Object.entries(areas).flatMap(([area, { pins, text }]) =>
				(
					pins.map((i, idx) => ({
						key: `${area}-p-${idx}`,
						area,
						text: [area, i.type, i.notes].filter((i) => i).join(' > '),
						original: i,
					})) as SearchItem[]
				).concat(
					text.map((i, idx) => ({
						key: `${area}-t-${idx}`,
						area,
						text: [area, i.text].filter((i) => i).join(' > '),
						original: i,
					}))
				)
			)
		);
		search.addIndex('text');
	});
	inputSearch.addEventListener('input', () => {
		const results = search.search(inputSearch.value) as SearchItem[];
		ulSearch.textContent = '';
		results.forEach((i) => {
			const li = document.createElement('li');
			const span = document.createElement('span');
			span.innerHTML = i.text;
			highlight(span, inputSearch.value, search.tokenizer.tokenize);
			const btnFocus = document.createElement('button');
			btnFocus.title = 'focus';
			btnFocus.textContent = '🔍';
			btnFocus.addEventListener('click', () => {
				contextDeselect();
				const a = i.area;
				if (current !== a) setArea(a);
				focus(i.original.x, i.original.y);
			});
			btnFocus.addEventListener('dblclick', () => {
				area.zoom = 1;
				updateZoomEffective();
			});
			li.appendChild(btnFocus);
			li.appendChild(span);
			ulSearch.appendChild(li);
		});
	});

	Array.from(btnPins).forEach((i) => {
		const option = document.createElement('option');
		option.value = i.value;
		datalistPinType.appendChild(option);
	});
	setArea(current);
	updateBrushSize();
})();
