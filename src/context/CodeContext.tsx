import React, { useEffect, useState } from 'react';
import useQuestion from '../hooks/useQuestion';

export type Comment = {
  id: string | number;
  text: string;
};

type File = {
  content: string;
  comments: Comment[];
};

interface ICodeContext {
  file: File;
  defaultCode: string;
  setFile: (files: File) => void;
  getRunFile: () => string;
}

const CodeContext = React.createContext<Partial<ICodeContext>>({});

type CodeProviderProps = {
  children: React.ReactNode;
};

export const CodeProvider = ({ children }: CodeProviderProps) => {
  const { initialCode, codeTemplate } = useQuestion();
  const defaultCode = initialCode
    ? initialCode.replaceAll('\\t', '\t').replaceAll('\\n', '\n')
    : '';
  const template = codeTemplate
    ? codeTemplate.replaceAll('\\t', '\t').replaceAll('\\n', '\n')
    : '';
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (file === undefined) {
      const localFile = JSON.parse(localStorage.getItem('file') as string);
      if (localFile && localFile.content.length > 0) {
        setFile(localFile);
      } else if (initialCode) {
        const initialFile = { comments: [], content: defaultCode };
        setFile(initialFile);
      }
    }
  }, [initialCode, file]);

  const getRunFile = () =>
    template.replace(
      '/** STUDENT CODE BEGINS **/\n\n/** STUDENT CODE ENDS **/',
      `/** STUDENT CODE BEGINS **/\n${file?.content}\n/** STUDENT CODE ENDS **/`
    );

  const context = React.useMemo(
    () => ({
      file,
      defaultCode,
      setFile,
      getRunFile,
    }),
    [file, setFile]
  );

  useEffect(() => {
    if (file !== undefined) {
      localStorage.setItem('file', JSON.stringify(file));
    }
  }, [file]);

  return (
    <CodeContext.Provider value={context}>{children}</CodeContext.Provider>
  );
};

const useCode = () => React.useContext(CodeContext);

export default useCode;
export type { File };
