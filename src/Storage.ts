import localForage from 'localforage';
import pkg from '../package.json';

localForage.config({
	name: pkg.name,
	storeName: pkg.name.replace(/^[a-zA-Z0-9_]/g, '_'), // Should be alphanumeric, with underscores.
	description: pkg.description,
});
const storage = localForage;

export type Image = {
	x: number;
	y: number;
	src: string;
};
export type Drawing = {
	points: [number, number][];
	colour: string;
	size: number;
};
export type Pin = {
	x: number;
	y: number;
	type: string;
	notes: string;
	images: string;
};
export type Text = {
	x: number;
	y: number;
	text: string;
	size: number;
};
export type Area = {
	offset: { x: number; y: number };
	zoom: number;
	images: { [key: string]: string };
	drawings: Drawing[];
	pins: Pin[];
	text: Text[];
};

type State = {
	grid: [number, number];
	current: string;
	areas: {
		[key: string]: Area;
	};
};
const initialState: State = {
	grid: [1920, 1080],
	current: 'area 0',
	areas: {
		'area 0': {
			offset: { x: 0, y: 0 },
			zoom: 1,
			images: {},
			drawings: [],
			pins: [],
			text: [],
		},
	},
};

const internalState: State = {
	grid: initialState.grid,
	current: initialState.current,
	areas: initialState.areas,
};

export async function init() {
	const saved = await storage.getItem<State>('storage');
	if (saved) {
		internalState.grid = saved.grid;
		internalState.current = saved.current;
		internalState.areas = saved.areas;
	}
}

export function get<K extends keyof State>(k: K) {
	return internalState[k];
}

export function set<K extends keyof State, V extends State[K]>(k: K, v: V) {
	internalState[k] = v;
	storage.setItem('storage', internalState);
}

export function reset() {
	set('grid', initialState.grid);
	set('current', initialState.current);
	set('areas', initialState.areas);
}
