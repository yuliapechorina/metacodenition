export type indexPair = {
  start: number;
  end: number;
};

const findOffsetOfNode = (node: Node | null) => {
  if (!node) return 0;
  const parent = node.parentNode;
  if (!parent) return 0;

  let offset = 0;
  let currNode = node.previousSibling;

  while (currNode !== null) {
    if (currNode.textContent) {
      offset += currNode.textContent.length;
    }
    currNode = currNode.previousSibling;
  }

  return offset;
};

const orderAndCombineIndices = (indices: indexPair[]) => {
  const orderedIndices = indices.sort((a, b) => a.start - b.start);

  const combinedIndices = orderedIndices.reduce(
    (acc: { start: number; end: number }[], curr) => {
      if (acc.length === 0) return [curr];
      const last = acc[acc.length - 1];
      if (curr.start <= last.end) {
        last.end = Math.max(last.end, curr.end);
        return acc;
      }
      return [...acc, curr];
    },
    []
  );

  return combinedIndices;
};

const generateSlices = (text: string, combinedIndices: indexPair[]) => {
  const textSlices: string[] = [];
  const highlightSliceIndices: number[] = [];

  textSlices.push(text.slice(0, combinedIndices[0].start));

  combinedIndices.forEach((pair, i) => {
    const { start, end } = pair;

    const slice = text.slice(start, end);
    textSlices.push(slice);
    highlightSliceIndices.push(textSlices.length - 1);

    const postSlice = text.slice(
      end,
      combinedIndices[i + 1] ? combinedIndices[i + 1].start : text.length
    );

    textSlices.push(postSlice);
  }, []);
  return { textSlices, highlightSliceIndices };
};

const highlightAndCombineSlices = (
  textSlices: string[],
  highlightSliceIndices: number[]
) =>
  textSlices.reduce((acc, curr, index) => {
    if (highlightSliceIndices.includes(index)) {
      return `${acc}<mark>${curr}</mark>`;
    }
    return acc + curr;
  }, '');

export const findHighlightInParent = (chunk: Selection): indexPair => {
  const offsetToAnchor =
    findOffsetOfNode(chunk.anchorNode) + chunk.anchorOffset;
  const offsetToFocus = findOffsetOfNode(chunk.focusNode) + chunk.focusOffset;

  const start = Math.min(offsetToAnchor, offsetToFocus);
  const end = Math.max(offsetToAnchor, offsetToFocus);

  return { start, end };
};

export const applyHighlightToText = (text: string, indices: indexPair[]) => {
  if (indices.length === 0) return text;

  const sortedIndices = orderAndCombineIndices(indices);

  const { textSlices, highlightSliceIndices } = generateSlices(
    text,
    sortedIndices
  );

  const highlightedText = highlightAndCombineSlices(
    textSlices,
    highlightSliceIndices
  );

  return highlightedText;
};
