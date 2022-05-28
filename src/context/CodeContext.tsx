import React, { useState } from 'react';

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

export const CodeProvider = ({ children }: CodeProviderProps) => {
  const [files, setFiles] = useState<File[]>([
    {
      id: 0,
      name: 'main.c',
      content: '#include "main.h"\n\nint main() {\n  printf("Hello, World!");\n  return 0;\n}',
    },
    {
      id: 1,
      name: 'main.h',
      content: '#include <stdio.h>\n\nint main();',
    }
  ]);

  const editFile = (fileId: number, content?: string) => {
    files!.find((f) => f.id === fileId)!.content = content!;
  };

  const context = React.useMemo(
    () => ({
      files,
      setFiles,
      editFile,
    }),
    [files, setFiles, editFile]
  );

  return (
    <CodeContext.Provider value={context}>{children}</CodeContext.Provider>
  );
};

const useCode = () => React.useContext(CodeContext);

export default useCode;
export type { File };
