export type IndexPair = {
  start: number;
  end: number;
};

export type Highlight = {
  id: number;
  indexPair: IndexPair;
  highlightedText: string;
  action: string;
};

type Slice = {
  text: string;
  highlight?: Highlight;
};

const findOffsetOfNode = (node: Node | null) => {
  if (!node) return 0;
  const parent = node.parentNode;
  if (!parent) return 0;

  let offset = 0;
  let currNode = node.previousSibling;

  while (currNode !== null) {
    if (currNode.hasChildNodes()) {
      offset += findOffsetOfNode(
        currNode.childNodes[currNode.childNodes.length - 1]
      );
    } else if (currNode.textContent && currNode.nodeName !== 'SPAN') {
      offset += currNode.textContent.length;
    }

    currNode = currNode.previousSibling;
  }

  return offset;
};

const orderAndCombineHighlights = (highlights: Highlight[]) => {
  const orderedHighlights = highlights.sort(
    (a, b) => a.indexPair.start - b.indexPair.start
  );

  const combinedHighlights = orderedHighlights.reduce(
    (acc: Highlight[], curr) => {
      if (acc.length === 0) return [curr];
      const last = acc[acc.length - 1];
      if (curr.indexPair.start <= last.indexPair.end) {
        last.indexPair.end = Math.max(last.indexPair.end, curr.indexPair.end);
        return acc;
      }
      return [...acc, curr];
    },
    []
  );

  return combinedHighlights;
};

const generateSlices = (text: string, highlights: Highlight[]) => {
  const slices: Slice[] = [];

  slices.push({ text: text.slice(0, highlights[0].indexPair.start) });

  highlights.forEach((highlight, i) => {
    const { start, end } = highlight.indexPair;

    const slice = { text: text.slice(start, end), highlight };
    slices.push(slice);

    const postSliceText = text.slice(
      end,
      highlights[i + 1] ? highlights[i + 1].indexPair.start : text.length
    );

    const postSlice = { text: postSliceText };

    slices.push(postSlice);
  }, []);
  return slices;
};

const highlightAndCombineSlices = (slices: Slice[]) =>
  slices.reduce((retString, slice) => {
    if (slice.highlight) {
      return `${retString}<mark className='bg-yellow-200 tooltip' id='${slice.highlight.id}'>${slice.text}<span class="tooltiptext">${slice.highlight.action}</span></mark>`;
    }
    return retString + slice.text;
  }, '');

export const findHighlightInParent = (chunk: Selection): IndexPair => {
  if (chunk.anchorNode!.parentNode!.nodeName === 'MARK') {
    const offset =
      findOffsetOfNode(chunk.anchorNode?.parentNode!) + chunk.anchorOffset;
    return { start: offset, end: offset };
  }

  const offsetToAnchor =
    findOffsetOfNode(chunk.anchorNode) + chunk.anchorOffset;
  const offsetToFocus = findOffsetOfNode(chunk.focusNode) + chunk.focusOffset;

  const start = Math.min(offsetToAnchor, offsetToFocus);
  const end = Math.max(offsetToAnchor, offsetToFocus);

  return { start, end };
};

export const applyHighlightToText = (
  text: string,
  highlights: Highlight[] | undefined
) => {
  if (!highlights || highlights.length === 0) return text;


  const sortedHighlights = orderAndCombineHighlights(highlights);

  const slices = generateSlices(text, sortedHighlights);

  const highlightedText = highlightAndCombineSlices(slices);

  return highlightedText;
};
