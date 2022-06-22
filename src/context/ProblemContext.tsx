import { doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import {
  findHighlightInParent,
  applyHighlightToText,
  Highlight,
} from '../pages/DesignPage/highlighter';

interface IProblemContext {
  getProblemStatement: () => string;
  highlightChunk: (chunk: Selection) => Highlight | undefined;
  removeHighlightedChunk: (highlight: Highlight) => void;
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

type ProblemProviderProps = {
  children: React.ReactNode;
};

export const ProblemProvider = ({ children }: ProblemProviderProps) => {
  const [user] = useAuthState(auth);

  const userDoc = user ? doc(db, 'users', user!.uid) : undefined;
  const [userData] = useDocumentData(userDoc);

  const [problemStatement] = useState<string>(initialProblem);

  const [highlights, setHighlights] = useState<Highlight[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (userData) {
      setHighlights(userData.highlights);
    }
  }, [userData]);

  const highlightChunk = (chunk: Selection): Highlight | undefined => {
    if (!highlights) {
      return undefined;
    }

    const indexPair = findHighlightInParent(chunk);

    const selectedHighlight = highlights?.find(
      (highlight) =>
        highlight.indexPair.start <= indexPair.start &&
        highlight.indexPair.end >= indexPair.end,
      indexPair
    );

    if (selectedHighlight || !chunk.toString) {
      return selectedHighlight;
    }

    const newHighlight: Highlight = {
      id: Math.floor(Math.random() * 100),
      indexPair,
      highlightedText: chunk.toString(),
      action: '',
    };

    const newHighlights = [...highlights, newHighlight];
    setHighlights(newHighlights);

    return newHighlight;
  };

  const removeHighlightedChunk = (highlight: Highlight) => {
    if (!highlights) {
      return;
    }

    const newHighlights = highlights.filter(
      (thisHighlight) => thisHighlight !== highlight
    );
    setHighlights(newHighlights);
  };

  const getProblemStatement = () =>
    `<p class='whitespace-pre-line'>${applyHighlightToText(
      problemStatement,
      highlights
    )}</p>`;

  const value = React.useMemo(
    () => ({
      problemStatement,
      getProblemStatement,
      highlightChunk,
      removeHighlightedChunk,
    }),
    [problemStatement, getProblemStatement, highlightChunk]
  );

  useEffect(() => {
    localStorage.setItem('problem', JSON.stringify(problemStatement));
  }, [problemStatement, highlights]);

  return (
    <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>
  );
};

const useProblem = () => React.useContext(ProblemContext);

export default useProblem;
