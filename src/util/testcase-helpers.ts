import { ITestCase, IFunction, IArgument } from './testcase';

export const buildFunctionString = (
  questionFunction: IFunction,
  argsString: string
) => {
  if (!questionFunction) {
    return '';
  }
  if (questionFunction.returnType !== 'void') {
    return `${questionFunction.returnType} return_value = ${questionFunction?.name}(${argsString});`;
  }
  return `${questionFunction?.name}(${argsString});`;
};

export const buildPrintString = (returnType: string) => {
  if (returnType === 'int') {
    return '\nprintf("%d", return_value);';
  }
  return '';
};

export const buildInitialisedFunctionString = (
  questionFunction: IFunction,
  args: IArgument[]
) =>
  buildFunctionString(
    questionFunction,
    args.map((arg) => arg.name).join(', ')
  ) + buildPrintString(questionFunction.returnType ?? '');

export const buildTestCaseString = (
  questionFunction: IFunction,
  testCase: ITestCase
) => {
  const nonInlineArgString = testCase.input.reduce((acc, curr, idx) => {
    const isArray = questionFunction?.arguments?.[idx]?.isArray ?? false;
    const arraySize = curr.size;
    const arrayInitializer = arraySize ? `[${arraySize.toString()}]` : '[]';
    if (!curr.inline) {
      return `${acc}${questionFunction?.arguments?.[idx]?.type} ${
        questionFunction?.arguments?.[idx]?.name
      }${isArray ? arrayInitializer : ''} = ${curr.value};\n`;
    }
    return acc;
  }, '');
  const functionArgsString = testCase.input.reduce((acc, curr, idx) => {
    if (curr.inline) {
      return acc ? `${acc}, ${curr.value}` : `${curr.value}`;
    }
    return acc
      ? `${acc}, ${questionFunction?.arguments?.[idx]?.name}`
      : `${questionFunction?.arguments?.[idx]?.name}`;
  }, '');
  const functionCall = buildFunctionString(
    questionFunction,
    functionArgsString
  );

  return `${nonInlineArgString}${functionCall}${buildPrintString(
    questionFunction.returnType ?? ''
  )}`;
};
