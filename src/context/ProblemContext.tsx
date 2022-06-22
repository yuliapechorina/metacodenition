import React, { useEffect, useState } from 'react';
import {
  indexPair,
  findHighlightInParent,
  applyHighlightToText,
} from '../pages/DesignPage/highlighter';

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

const initialHighlightIndices: indexPair[] =
  JSON.parse(localStorage.getItem('highlightIndices') as string) || [];

type ProblemProviderProps = {
  children: React.ReactNode;
};

export const ProblemProvider = ({ children }: ProblemProviderProps) => {
  const [problemStatement] = useState<string>(initialProblem);

  const [highlightIndices, setHighlightIndices] = useState<indexPair[]>(
    initialHighlightIndices
  );

  const highlightChunk = (chunk: Selection) => {
    if (chunk.toString() === '') return;
    const newHighlightIndices = [
      ...highlightIndices,
      findHighlightInParent(chunk),
    ];
    setHighlightIndices(newHighlightIndices);
  };

  const getProblemStatement = () =>
    `<p class='whitespace-pre'>${applyHighlightToText(
      problemStatement,
      highlightIndices
    )}</p>`;

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
