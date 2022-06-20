const stripTagsInArray = (array: string[]): string[] => {
  const newArray: string[] = [...array];
  const openIndexArray: number[] = [];
  array.forEach((element, index) => {
    if (element.includes('<') || element.includes('</')) {
      openIndexArray.push(index);
    }
    if (element.includes('>') || element.includes('/>')) {
      const openIndex = openIndexArray.pop();
      if (newArray[openIndex!] && newArray[index]) {
        newArray[openIndex!] = newArray[openIndex!].slice(
          0,
          newArray[openIndex!].indexOf('<')!
        );
        newArray[index] = newArray[index].slice(
          newArray[index].indexOf('>')!,
          newArray[index].length - 1
        );
      }
      newArray.splice(openIndex! + 1, index - openIndex!);
    }
  });
  return newArray;
};

const getDistance = (
  index1: number,
  index2: number,
  textArray: string[],
  chunk: string
) => {
  const subArray = textArray.slice(index1, index2 + 1);
  const subString = stripTagsInArray(subArray).join('');
  return Math.abs(chunk.length - subString.length);
};

const findIndices = (
  chunkArray: string[],
  textArray: string[],
  chunk: string
): number[] => {
  const startIndexes = textArray.reduce<number[]>((arr, element, index) => {
    if (element === chunkArray[0]) arr.push(index);
    return arr;
  }, []);

  const endIndexes = textArray.reduce<number[]>((arr, element, index) => {
    if (element === chunkArray[chunkArray.length - 1]) arr.push(index);
    return arr;
  }, []);
  let smallestDistance = Infinity;
  let indices = [-1, -1];
  startIndexes.forEach((startIndex) => {
    endIndexes.forEach((endIndex) => {
      if (startIndex <= endIndex) {
        const distance = getDistance(startIndex, endIndex, textArray, chunk);
        if (distance < smallestDistance) {
          indices = [startIndex, endIndex];
          smallestDistance = distance;
        }
      }
    });
  });

  return indices;
};

const highlightChunkInText = (chunk: string, text: string): string => {
  const chunkArray = chunk.match(/\w+|\s+|[^\s\w]+/g);
  const textArray = text.match(/\w+|\s+|[^\s\w]+/g);

  const [indexOfStart, indexOfEnd] = findIndices(
    chunkArray!,
    textArray!,
    chunk
  );
  if (indexOfStart === -1 || indexOfEnd === -1) {
    return text;
  }
  textArray?.splice(indexOfStart, 0, `<mark className='bg-yellow-200'> `);
  textArray?.splice(indexOfEnd + 2, 0, '</mark> ');
  console.log(textArray!.join(''));
  return textArray!.join('');
};

export default highlightChunkInText;
