import React, { useEffect, useState } from 'react';

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
  defaultFile: File;
  setFile: (files: File) => void;
  getRunFile: () => string;
}

const CodeContext = React.createContext<Partial<ICodeContext>>({});

type CodeProviderProps = {
  children: React.ReactNode;
};

const defaultFile: File = {
  content:
    '#include <stdio.h>\nvoid rainfall_problem(int* first_measurement, int number_of_days) { \n    // Create a sum (User Generated)\n    int sum = 0;\n    float count = 0.0;\n    for(int i = 0; i < number_of_days; i++) {\n      int temp = *(first_measurement + i);\n      // Check if the amount is negative (User Generated)\n      if (temp < 0) { continue; }\n      sum += temp;\n      // Count Values\n      count += 1;\n    }\n\n    // Perform a Calculation\n    float average = sum / count;\n\n    // Check if the average is greater than zero (User Generated)\n    if (average == 0) { printf("No rain"); return; }\n\n    // Print an Output\n    printf("%f", average);\n}',
  comments: [],
};

const template =
  '/**\n *  RAINFALL PROBLEM TEMPLATE FILE\n**/\n\n/** STUDENT CODE BEGINS **/\n\n/** STUDENT CODE ENDS **/\n\n/** RUN CODE BEGINS **/\n#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\nint main() {\n\tchar string_in[200];\n\tfgets(string_in, sizeof(string_in), stdin);\n\n\tconst char find = \'[\';\n\tconst char replace = \' \';\n\tchar *current_pos = strchr(string_in, find);\n\twhile (current_pos) {\n\t\t*current_pos = replace;\n\t\tcurrent_pos = strchr(current_pos, find);\n\t}\n\n\tchar *current_str;\n\tint current_number;\n\tint numbers[50] = {0};\n\tint numbers_length = 0;\n\n\tcurrent_str = strtok(string_in, " ");\n\twhile(current_str != NULL) {\n\t\tcurrent_number = atoi(current_str);\n\t\tnumbers[numbers_length] = current_number;\n\t\tnumbers_length++;\n\t\tcurrent_str = strtok(NULL, " ");\n\t}\n\n\trainfall_problem(numbers, numbers_length);\n\n\treturn 0;\n}\n/** RUN CODE ENDS **/';

const initialFile: File =
  JSON.parse(localStorage.getItem('file') as string) || defaultFile;

export const CodeProvider = ({ children }: CodeProviderProps) => {
  const [file, setFile] = useState<File>(initialFile);

  const getRunFile = () =>
    template.replace(
      '/** STUDENT CODE BEGINS **/\n\n/** STUDENT CODE ENDS **/',
      `/** STUDENT CODE BEGINS **/\n${file.content}\n/** STUDENT CODE ENDS **/`
    );

  const context = React.useMemo(
    () => ({
      file,
      defaultFile,
      setFile,
      getRunFile,
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
