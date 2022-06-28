import React, { useEffect, useState } from 'react';

type File = {
  content: string;
};

interface ICodeContext {
  file: File;
  defaultFile: File;
  setFile: (files: File) => void;
}

const CodeContext = React.createContext<Partial<ICodeContext>>({});

type CodeProviderProps = {
  children: React.ReactNode;
};

const defaultFile: File = {
  content: 'int main() {\n  printf("Hello, World!");\n  return 0;\n}',
};

const initialFile: File =
  JSON.parse(localStorage.getItem('file') as string) || defaultFile;

export const CodeProvider = ({ children }: CodeProviderProps) => {
  const [file, setFile] = useState<File>(initialFile);

  const context = React.useMemo(
    () => ({
      file,
      defaultFile,
      setFile,
    }),
    [file, setFile]
  );

  useEffect(() => {
    localStorage.setItem('file', JSON.stringify(file));
  }, [file]);

  return (
    <CodeContext.Provider value={context}>{children}</CodeContext.Provider>
  );
};

const useCode = () => React.useContext(CodeContext);

export default useCode;
export type { File };
