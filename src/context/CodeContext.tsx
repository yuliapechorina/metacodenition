import React, { useEffect, useState } from 'react';

type File = {
  id: number;
  name: string;
  content: string;
};

interface ICodeContext {
  files: File[];
  setFiles: (files: File[]) => void;
  editFile: (fileId: number, content: string) => void;
}

const CodeContext = React.createContext<Partial<ICodeContext>>({});

type CodeProviderProps = {
  children: React.ReactNode;
};

const defaultFiles: File[] = [
  {
    id: 0,
    name: 'main.c',
    content:
      '#include "main.h"\n\nint main() {\n  printf("Hello, World!");\n  return 0;\n}',
  },
  {
    id: 1,
    name: 'main.h',
    content: '#include <stdio.h>\n\nint main();',
  },
];

const initialFiles: File[] =
  JSON.parse(localStorage.getItem('files') as string) || defaultFiles;

export const CodeProvider = ({ children }: CodeProviderProps) => {
  const [files, setFiles] = useState<File[]>(initialFiles);

  const editFile = (fileId: number, content: string) => {
    const newFiles = files.map((file) =>
      file.id === fileId
        ? {
            ...file,
            content,
          }
        : file
    );
    setFiles(newFiles);
  };

  const context = React.useMemo(
    () => ({
      files,
      setFiles,
      editFile,
    }),
    [files, setFiles, editFile]
  );

  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);

  return (
    <CodeContext.Provider value={context}>{children}</CodeContext.Provider>
  );
};

const useCode = () => React.useContext(CodeContext);

export default useCode;
export type { File };
