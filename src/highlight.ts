function caseInsensitiveReplaceAll(
	source: string,
	terms: string[],
	replaceWith: string
) {
	return source.replace(
		new RegExp(
			`(${terms
				.map((i) => i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
				.join('|')})`,
			'ig'
		),
		replaceWith
	);
}

function getTextNodesIn(node: Element, includeWhitespaceNodes: boolean) {
	const textNodes: Text[] = [],
		whitespace = /^\s*$/;

	function getTextNodes(node: Node) {
		if (node.nodeType == 3) {
			if (includeWhitespaceNodes || !whitespace.test(node.nodeValue || '')) {
				textNodes.push(node as Text);
			}
		} else {
			for (var i = 0, len = node.childNodes.length; i < len; ++i) {
				getTextNodes(node.childNodes[i]);
			}
		}
	}

	getTextNodes(node);
	return textNodes;
}
const enhanceNodes = (textNodes: Text[], enhance: (text: string) => string) => {
	textNodes.forEach((node) => {
		const oldText = node.textContent;
		const newText = enhance(oldText || '');
		const fragment = document.createRange().createContextualFragment(newText);
		node.replaceWith(fragment);
	});
};
export const highlight = (
	source: Element,
	term: string,
	tokenize: (term: string) => string[]
) => {
	const termTokens = tokenize(term);
	let nodes = getTextNodesIn(source, true);
	enhanceNodes(nodes, (text) =>
		caseInsensitiveReplaceAll(text, [term], `<mark class="exact">$1</mark>`)
	);
	nodes = getTextNodesIn(source, true);
	enhanceNodes(nodes, (text) =>
		caseInsensitiveReplaceAll(text, termTokens, `<mark>$1</mark>`)
	);
};
