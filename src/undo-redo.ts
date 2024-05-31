type UndoRedo = {
	name?: string;
	undo(): void;
	redo(): void;
};

const stack: UndoRedo[] = [];
let idx = -1;

const maxUndos = 50;

export function pushUndoRedo(command: UndoRedo) {
	stack.splice(idx + 1, stack.length);
	stack.push(command);
	while (stack.length > maxUndos) {
		stack.shift();
	}
	idx = stack.length - 1;
	stack[idx].redo();
}

export function undo() {
	const s = stack[idx];
	if (!s) {
		idx = -1;
		return false;
	}
	s.undo();
	--idx;
	return s.name;
}

export function redo() {
	++idx;
	const s = stack[idx];
	if (!s) {
		idx = stack.length - 1;
		return false;
	}
	s?.redo();
	return s?.name;
}
