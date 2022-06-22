const findOffsetOfNode = (node: Node | null) => {
  if (!node) return 0;
  const parent = node.parentNode;
  if (!parent) return 0;
  // Sum the length of all the text nodes before the current node
  let offset = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < parent.childNodes.length; i++) {
    const child = parent.childNodes[i];
    if (child === node) {
      break;
    }
    // eslint-disable-next-line no-continue
    if (!child.textContent) continue;
    offset += child.textContent.length;
  }
  // eslint-disable-next-line consistent-return
  return offset;
};

const findHighlightIndices = (
  chunk: Selection
): { start: number; end: number } => {
  const start = findOffsetOfNode(chunk.anchorNode) + chunk.anchorOffset;
  const end = findOffsetOfNode(chunk.focusNode) + chunk.focusOffset;
  return { start, end };
};

export default findHighlightIndices;
