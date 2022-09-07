import React, { useCallback, useEffect, useState } from 'react';
import useQuestion from '../hooks/useQuestion';
import { IArgument } from '../util/testcase';
import useAssignment from './AssignmentContext';

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
  setFile: (files: File | undefined) => void;
  getRunFile: (args: IArgument[]) => string;
}

const CodeContext = React.createContext<Partial<ICodeContext>>({});

type CodeProviderProps = {
  children: React.ReactNode;
};

export const CodeProvider = ({ children }: CodeProviderProps) => {
  const { questionId } = useAssignment();
  const { initialCode, codeTemplate } = useQuestion();

  const defaultCode = initialCode
    ? initialCode.replaceAll('\\t', '\t').replaceAll('\\n', '\n')
    : '';
  const template = codeTemplate
    ? codeTemplate.replaceAll('\\t', '\t').replaceAll('\\n', '\n')
    : '';

  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    if (questionId) {
      setFile(undefined);
    }
  }, [initialCode]);

  useEffect(() => {
    if (file === undefined && questionId !== undefined) {
      const localFile = JSON.parse(
        localStorage.getItem(`file-${questionId}`) as string
      );
      if (localFile && localFile.content) {
        setFile(localFile);
      } else if (initialCode) {
        const initialFile = { comments: [], content: defaultCode };
        setFile(initialFile);
      }
    }
  }, [initialCode, file]);

  const getRunFile = useCallback(
    (args: IArgument[]) => {
      const templateWithStudentCode = template.replace(
        '/** STUDENT CODE BEGINS **/\n\n/** STUDENT CODE ENDS **/',
        `/** STUDENT CODE BEGINS **/\n${file?.content}\n/** STUDENT CODE ENDS **/`
      );
      return args.reduce(
        (newFile, arg) =>
          newFile.replace(`<ARGUMENT_${arg.name}>`, `${arg.value}`),
        templateWithStudentCode
      );
    },
    [template, file]
  );

  useEffect(() => {
    if (file !== undefined && questionId !== undefined) {
      localStorage.setItem(`file-${questionId}`, JSON.stringify(file));
    }
  }, [file]);

  const context = React.useMemo(
    () => ({
      file,
      defaultCode,
      setFile,
      getRunFile,
    }),
    [file, setFile, getRunFile, initialCode, codeTemplate]
  );

  return (
    <CodeContext.Provider value={context}>{children}</CodeContext.Provider>
  );
};

const useCode = () => React.useContext(CodeContext);

export default useCode;
export type { File };
