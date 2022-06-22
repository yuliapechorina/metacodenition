import React, { useEffect, useState } from 'react';
import findHighlightIndices from '../pages/DesignPage/highlighter';

interface IProblemContext {
  getProblemStatement: () => string;
  highlightChunk: (chunk: Selection) => void;
}

const ProblemContext = React.createContext<Partial<IProblemContext>>({});

const defaultProblem = `
Let's imagine that you have a list that contains amounts of rainfall for each day, collected by a meteorologist. Her rain gathering equipment occasionally makes a mistake and reports a negative amount for that day. We have to ignore those.
We need to write a program to:

  (a) calculate the total rainfall by adding up all the positive integers (and only the positive integers), 
  (b) count the number of positive integers (we will count with “1.0” so that our average can have a decimal point), and 
  (c) print out the average rainfall at the end.

Only print the average if there was some rainfall, otherwise print “No rain”.
`;

const initialProblem: string =
  JSON.parse(localStorage.getItem('problem') as string) || defaultProblem;

const initialHighlightIndices: { start: number; end: number }[] =
  JSON.parse(localStorage.getItem('highlightIndices') as string) || [];

type ProblemProviderProps = {
  children: React.ReactNode;
};

export const ProblemProvider = ({ children }: ProblemProviderProps) => {
  const [problemStatement] = useState<string>(initialProblem);

  const [highlightIndices, setHighlightIndices] = useState<
    { start: number; end: number }[]
  >(initialHighlightIndices);

  const highlightChunk = (chunk: Selection) => {
    if (chunk.toString() === '') return;
    const newHighlightIndices = [
      ...highlightIndices,
      findHighlightIndices(chunk),
    ];
    setHighlightIndices(newHighlightIndices);
  };

  const getProblemStatement = () => {
    if (highlightIndices.length === 0)
      return `<p class='whitespace-pre'>${problemStatement}</p>`;

    // Order the indices by start position
    const orderedHighlightIndices = highlightIndices.sort(
      (a, b) => a.start - b.start
    );
    // Combine where overlap of indices occurs
    const combinedHighlightIndices = orderedHighlightIndices.reduce(
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

    // Split the problemStatement into slices of text by indices
    const problemStatementSlices: string[] = [];
    const highlightIndexes: number[] = [];

    problemStatementSlices.push(
      problemStatement.slice(0, combinedHighlightIndices[0].start)
    );

    combinedHighlightIndices.forEach((highlightIndex, i) => {
      const { start, end } = highlightIndex;
      const slice = problemStatement.slice(start, end);
      problemStatementSlices.push(slice);
      highlightIndexes.push(problemStatementSlices.length - 1);

      const postSlice = problemStatement.slice(
        end,
        combinedHighlightIndices[i + 1]
          ? combinedHighlightIndices[i + 1].start
          : problemStatement.length
      );
      problemStatementSlices.push(postSlice);
    }, []);

    // Create a new string with the highlighted chunks
    const newProblemStatement = problemStatementSlices.reduce(
      (acc, curr, index) => {
        if (highlightIndexes.includes(index)) {
          return `${acc}<mark>${curr}</mark>`;
        }
        return acc + curr;
      },
      ''
    );

    return `<p class='whitespace-pre'>${newProblemStatement}</p>`;
  };

  const value = React.useMemo(
    () => ({
      problemStatement,
      getProblemStatement,
      highlightChunk,
    }),
    [problemStatement, getProblemStatement, highlightChunk]
  );

  useEffect(() => {
    localStorage.setItem('problem', JSON.stringify(problemStatement));
    localStorage.setItem('highlightIndices', JSON.stringify(highlightIndices));
  }, [problemStatement, highlightIndices]);

  return (
    <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>
  );
};

const useProblem = () => React.useContext(ProblemContext);

export default useProblem;
