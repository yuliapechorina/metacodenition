import React, { useState } from 'react';

interface ICodeContext {
  codeFiles: Map<string, string>;
  addCodeToFile: (fileName: string, code: string) => void;
  getCodeFromFile: (fileName: string) => string;
}

const CodeContext = React.createContext<Partial<ICodeContext>>({});

type CodeProviderProps = {
  children: React.ReactNode;
};

export const CodeProvider = ({ children }: CodeProviderProps) => {
  const [codeFiles, setCodeFiles] = useState(new Map<string, string>());

  const addCodeToFile = (fileName: string, code: string) => {
    setCodeFiles(new Map(codeFiles.set(fileName, code)));
  };

  const getCodeFromFile = (fileName: string): string => {
    const code = codeFiles.get(fileName);
    if (code) return code;
    return '';
  };

  const context = React.useMemo(
    () => ({
      codeFiles,
      addCodeToFile,
      getCodeFromFile,
    }),
    [codeFiles, addCodeToFile, getCodeFromFile]
  );

  return (
    <CodeContext.Provider value={context}>{children}</CodeContext.Provider>
  );
};

const useCode = () => React.useContext(CodeContext);

export default useCode;
