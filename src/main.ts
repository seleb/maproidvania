import { get, set } from './Storage';

(async () => {
	let current = get('current');
	const areas = get('areas');
	let area = areas[current];

	let zoomEffective = 1;
	const updateZoomEffective = () => {
		zoomEffective = Math.pow(1.1, area.zoom);
	};

	const bgGridSize = 256;

	const divControls = document.querySelector<HTMLDivElement>('#controls');
	const divMapContainer =
		document.querySelector<HTMLDivElement>('#map-container');
	const divMap = document.querySelector<HTMLDivElement>('#map');
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
	const btnSelect = document.querySelector<HTMLInputElement>('#btn-select');
	const btnPan = document.querySelector<HTMLInputElement>('#btn-pan');
	const btnText = document.querySelector<HTMLInputElement>('#btn-text');
	const btnColours = document.querySelectorAll<HTMLInputElement>(
		'#options-colour > *'
	);
	const btnPins =
		document.querySelectorAll<HTMLInputElement>('#options-pin input');
	const divContext = document.querySelector<HTMLDivElement>('#context');
	const btnMove = document.querySelector<HTMLButtonElement>('#context-move');
	const btnDelete =
		document.querySelector<HTMLButtonElement>('#context-delete');
	const textareaNotes =
		document.querySelector<HTMLTextAreaElement>('#context-notes');
	const ulImages = document.querySelector<HTMLUListElement>('#context-images');
	if (
		!divControls ||
		!divMapContainer ||
		!divMap ||
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
		!btnColours.length ||
		!btnPins.length ||
		!divContext ||
		!btnMove ||
		!btnDelete ||
		!textareaNotes ||
		!ulImages
	)
		throw new Error('Could not find elements');

	btnAboutToggle.addEventListener('click', () => {
		divAbout.classList.toggle('show');
	});

	Object.keys(areas).forEach((i) => {
		const elOption = document.createElement('option');
		elOption.value = i;
		elOption.textContent = i;
		if (i === current) elOption.selected = true;
		selectAreas.appendChild(elOption);
	});
	selectAreas.addEventListener('change', () => {
		current = selectAreas.value;
		set('current', current);
		area = areas[current];
		// TODO: change displayed area
		updateZoomEffective();
		updateMap();
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
			images: [],
			drawings: [],
			pins: [],
			text: [],
		};
		selectAreas.value = key;
		selectAreas.dispatchEvent(new Event('change'));
		set('areas', areas);
	});
	btnAreaRename.addEventListener('click', () => {
		const key = window.prompt('rename area', current);
		if (!key) return;
		areas[key] = areas[current];
		delete areas[current];
		current = key;
		selectAreas.selectedOptions[0].value =
			selectAreas.selectedOptions[0].textContent = current;
		set('current', current);
		set('areas', areas);
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
		set('current', current);
		set('areas', areas);
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
		divMapContainer.style.backgroundSize = `${bgGridSize * z}px`;
		divMapContainer.style.backgroundPositionX = `${-area.offset.x}px`;
		divMapContainer.style.backgroundPositionY = `${-area.offset.y}px`;
		divMap.style.transform = `translate(${-area.offset.x}px, ${-area.offset
			.y}px) scale(${zoomEffective})`;
		document.querySelectorAll<HTMLDivElement>('#pins > *').forEach((i) => {
			i.style.transform = `translate(-50%, -50%) scale(${1 / zoomEffective})`;
		});
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
		const start = { x: event.pageX, y: event.pageY };
		area.offset.x = event.pageX;
		area.offset.y = event.pageY;
		const cursorOld = divMapContainer.style.cursor;
		divMapContainer.style.cursor = 'grabbing';
		const drag = (event: PointerEvent) => {
			area.offset.x = -(event.pageX - start.x) + current.x;
			area.offset.y = -(event.pageY - start.y) + current.y;
			updateMap();
		};
		const stopDragging = () => {
			window.removeEventListener('pointermove', drag);
			divMapContainer.style.cursor = cursorOld;
		};
		window.addEventListener('pointermove', drag);
		window.addEventListener('pointerup', stopDragging, { once: true });
	};

	let selected: HTMLElement | null = null;
	const updateContextImages = () => {
		const el = selected;
		if (!el) return;
		ulImages.textContent = '';
		const imgs = el.dataset.images?.split('|') || [];
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
				el.dataset.images = Array.from(ulImages.querySelectorAll('img'))
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
	const contextSelect = (el: HTMLElement) => {
		selected = el;
		divContext.classList.add('show');
		const r = selected.getBoundingClientRect();
		selected.classList.add('selected');
		textareaNotes.value = selected.dataset.notes || '';
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
	};
	const contextDeselect = () => {
		divContext.classList.remove('show');
		selected?.classList.remove('selected');
		selected = null;
	};

	btnMove.addEventListener('click', () => {
		window.alert('TODO: implement');
	});
	btnDelete.addEventListener('click', () => {
		if (!selected) return;
		const el = selected;
		contextDeselect();
		el.remove();
	});
	textareaNotes.addEventListener('input', () => {
		if (!selected) return;
		selected.dataset.notes = textareaNotes.value;
	});

	divMapContainer.addEventListener('pointerdown', (event) => {
		(document.activeElement as HTMLElement | null)?.blur();
		event.preventDefault();
		if (event.button === 1) {
			startDragging(event);
			return;
		}
		if (tool === 'select') {
			contextDeselect();
			const element = document.elementFromPoint(
				event.pageX,
				event.pageY
			) as HTMLElement | null;
			if (!element?.closest('#pins')) {
				return;
			}
			contextSelect(element);
		} else if (tool === 'pan') {
			startDragging(event);
		} else if (tool === 'pin') {
			const pin = toolOption;
			const elPin = document.createElement('div');
			elPin.textContent = pin;
			const p = getPosMouseMap();
			elPin.style.top = `${p.y}px`;
			elPin.style.left = `${p.x}px`;
			layerPins.appendChild(elPin);
			updateMap();
		} else if (tool === 'colour') {
			const colour = toolOption;
			startDrawing(colour);
		} else if (tool === 'text') {
			const elText = document.createElement('textarea');
			elText.placeholder = 'Type here...';
			layerText.appendChild(elText);
			updateMap();
		}
	});

	// sync mouse
	divMapContainer.addEventListener('pointermove', (event) => {
		divCursor.style.left = `${event.pageX}px`;
		divCursor.style.top = `${event.pageY}px`;
	});

	const onPasteImage = (img: string) => {
		if (selected) {
			addImageNote(img);
		} else {
			addImage(img);
		}
	};

	const addImageNote = (img: string) => {
		if (!selected) return;
		selected.dataset.images = [selected.dataset.images, img]
			.filter((i) => i)
			.join('|');
		updateContextImages();
	};

	const addImage = (img: string) => {
		const elImg = document.createElement('img');
		elImg.src = img;
		elImg.draggable = false;
		const p = getPos(0, 0);
		elImg.style.top = `${p.y}px`;
		elImg.style.left = `${p.x}px`;
		layerDrawings.appendChild(elImg);
	};

	// paste to add image
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
					if (result?.startsWith('data:image')) onPasteImage(result);
				};
				reader.readAsDataURL(blob);
			}
		}
	});

	let panning = false;
	window.addEventListener('keydown', (event) => {
		// ctrl+s to save
		if (event.ctrlKey && event.key === 's') {
			event.preventDefault();
			set('areas', areas);
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
		updateMap();
	});

	updateZoomEffective();
	updateMap();
})();
