import React from 'react';

interface IProblemContext {
  problemStatement: string;
}

const ProblemContext = React.createContext<Partial<IProblemContext>>({});

const problemStatement = `
<p>
Let's imagine that you have a list that contains amounts of rainfall for each day, collected by a meteorologist. Her rain gathering equipment occasionally makes a mistake and reports a negative amount for that day. We have to ignore those.
<br/>We need to write a program to:
<p className="pl-4">
  <br/>(a) calculate the total rainfall by adding up all the positive integers (and only the positive integers), 
  <br/>(b) count the number of positive integers (we will count with “1.0” so that our average can have a decimal point), and 
  <br/>(c) print out the average rainfall at the end. 
</p>
<br/>Only print the average if there was some rainfall, otherwise print “No rain”.
</p>
`;

type ProblemProviderProps = {
  children: React.ReactNode;
};

export const ProblemProvider = ({ children }: ProblemProviderProps) => {
  const value = React.useMemo(
    () => ({
      problemStatement,
    }),
    [problemStatement]
  );

  return (
    <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>
  );
};

const useProblem = () => React.useContext(ProblemContext);

export default useProblem;