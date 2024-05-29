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
	x: number;
	y: number;
	path: [number, number][];
	colour: string;
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
};
export type Area = {
	offset: { x: number; y: number };
	zoom: number;
	images: Image[];
	drawings: Drawing[];
	pins: Pin[];
	text: Text[];
};

type State = {
	current: string;
	areas: {
		[key: string]: Area;
	};
};
const initialState: State = {
	current: 'default',
	areas: {
		default: {
			offset: { x: 0, y: 0 },
			zoom: 1,
			images: [],
			drawings: [],
			pins: [],
			text: [],
		},
	},
};

const internalState: State = {
	current: initialState.current,
	areas: initialState.areas,
};

export async function init() {
	const saved = await storage.getItem<State>('storage');
	if (saved) {
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
	set('current', initialState.current);
	set('areas', initialState.areas);
}
