import getStroke from 'perfect-freehand';
import { Drawing } from './Storage';

const average = (a: number, b: number) => (a + b) / 2;

export function getSvgPathFromStroke(points: number[][], closed = true) {
	const len = points.length;

	if (len < 4) {
		return ``;
	}

	let a = points[0];
	let b = points[1];
	const c = points[2];

	let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
		2
	)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
		b[1],
		c[1]
	).toFixed(2)} T`;

	for (let i = 2, max = len - 1; i < max; i++) {
		a = points[i];
		b = points[i + 1];
		result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
			2
		)} `;
	}

	if (closed) {
		result += 'Z';
	}

	return result;
}

export function getPath(drawing: Drawing) {
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttributeNS(null, 'fill', drawing.colour);
	updatePath(path, drawing.points, drawing.size);
	return path;
}

export function updatePath(
	path: SVGPathElement,
	points: number[][],
	size: number
) {
	path.setAttributeNS(
		null,
		'd',
		getSvgPathFromStroke(
			getStroke(points, {
				size,
				smoothing: 0.5,
				streamline: 0.25,
				thinning: 0.5,
			})
		)
	);
}
