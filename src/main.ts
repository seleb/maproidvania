(async () => {
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
		!btnPins.length
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
		divMapContainer.style.backgroundSize = `${64 * zoomEffective}px`;
		divMapContainer.style.backgroundPositionX = `${-offset.x}px`;
		divMapContainer.style.backgroundPositionY = `${-offset.y}px`;
		divMap.style.transform = `translate(${-offset.x}px, ${-offset.y}px) scale(${zoomEffective})`;
		document.querySelectorAll<HTMLDivElement>('.layer > *').forEach((i) => {
			i.style.transform = `scale(${1 / zoomEffective})`;
		});
	};

	const getPos = (x: number, y: number) => {
		return { x: x + offset.x, y: y + offset.y };
	};
	const getPosMouse = () => {
		return getPos(
			parseFloat(divCursor.style.left),
			parseFloat(divCursor.style.top)
		);
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

	divMapContainer.addEventListener('pointerdown', (event) => {
		event.preventDefault();
		if (tool === 'select') {
		} else if (tool === 'pan') {
			startDragging(event);
		} else if (tool === 'pin') {
			const pin = toolOption;
			const elPin = document.createElement('div');
			elPin.textContent = pin;
			const p = getPosMouse();
			elPin.style.top = `${p.y / zoomEffective}px`;
			elPin.style.left = `${p.x / zoomEffective}px`;
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
		divCursor.style.left = `${event.pageX - divCursor.clientWidth / 2}px`;
		divCursor.style.top = `${event.pageY - divCursor.clientHeight / 2}px`;
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

	// zoom in/out
	divMapContainer.addEventListener('wheel', (event) => {
		zoom -= Math.sign(event.deltaY);
		zoomEffective = Math.pow(2, zoom);
		updateMap();
	});
})();
