(async () => {
	const bgGridSize = 256;

	const formControls = document.querySelector<HTMLFormElement>('#controls');
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
	const btnNotes =
		document.querySelector<HTMLTextAreaElement>('#context-notes');
	const ulImages = document.querySelector<HTMLUListElement>('#context-images');
	if (
		!formControls ||
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
		!btnColours.length ||
		!btnPins.length ||
		!divContext ||
		!btnMove ||
		!btnDelete ||
		!btnNotes ||
		!ulImages
	)
		throw new Error('Could not find elements');

	btnAboutToggle.addEventListener('click', () => {
		divAbout.classList.toggle('show');
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

	let zoom = 0;
	let zoomEffective = 1;
	const offset = { x: -window.innerWidth / 2, y: -window.innerHeight / 2 };

	const updateMap = () => {
		let z = zoomEffective;
		while (z > 4) {
			z /= 2;
		}
		while (z < 1) {
			z *= 2;
		}
		divMapContainer.style.backgroundSize = `${bgGridSize * z}px`;
		divMapContainer.style.backgroundPositionX = `${-offset.x}px`;
		divMapContainer.style.backgroundPositionY = `${-offset.y}px`;
		divMap.style.transform = `translate(${-offset.x}px, ${-offset.y}px) scale(${zoomEffective})`;
		document.querySelectorAll<HTMLDivElement>('#pins > *').forEach((i) => {
			i.style.transform = `translate(-50%, -50%) scale(${1 / zoomEffective})`;
		});
	};

	const getPos = (x: number, y: number) => {
		return { x: x + offset.x, y: y + offset.y };
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
		const current = { ...offset };
		const start = { x: event.pageX, y: event.pageY };
		offset.x = event.pageX;
		offset.y = event.pageY;
		divMapContainer.style.cursor = 'grabbing';
		const drag = (event: PointerEvent) => {
			offset.x = -(event.pageX - start.x) + current.x;
			offset.y = -(event.pageY - start.y) + current.y;
			updateMap();
		};
		const stopDragging = () => {
			window.removeEventListener('pointermove', drag);
			divMapContainer.style.cursor = 'grab';
		};
		window.addEventListener('pointermove', drag);
		window.addEventListener('pointerup', stopDragging, { once: true });
	};

	let selected: HTMLElement | null = null;
	const contextSelect = (el: HTMLElement) => {
		selected = el;
		divContext.classList.add('show');
		const r = selected.getBoundingClientRect();
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
		selected.classList.add('selected');
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

	divMapContainer.addEventListener('pointerdown', (event) => {
		event.preventDefault();
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
					if (result?.startsWith('data:image')) addImage(result);
				};
				reader.readAsDataURL(blob);
			}
		}
	});

	// hold space to pan
	let panning = false;
	window.addEventListener('keydown', (event) => {
		if (panning) return;
		if (event.key !== ' ') return;

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
	});

	const focus = (x: number, y: number) => {
		offset.x = x - window.innerWidth / 2 / zoomEffective;
		offset.y = y - window.innerHeight / 2 / zoomEffective;
		updateMap();
	};

	// zoom in/out
	divMapContainer.addEventListener('wheel', (event) => {
		zoom -= Math.sign(event.deltaY);
		const zoomEffectiveOld = zoomEffective;
		zoomEffective = Math.pow(1.1, zoom);

		const zoomEffectiveChange = zoomEffective - zoomEffectiveOld;
		const mouse = getPosMouseScreen();
		const zoomPoint = {
			x: (mouse.x + offset.x) / zoomEffectiveOld,
			y: (mouse.y + offset.y) / zoomEffectiveOld,
		};
		offset.x += zoomPoint.x * zoomEffectiveChange;
		offset.y += zoomPoint.y * zoomEffectiveChange;
		updateMap();
	});

	updateMap();
})();
