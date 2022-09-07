import { ITestCase, IFunction } from './testcase';

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

export const buildTestCaseString = (
  questionFunction: IFunction,
  testCase: ITestCase
) => {
  const nonInlineArgString = testCase.input.reduce((acc, curr, idx) => {
    if (!curr.inline) {
      return `${acc}${questionFunction?.arguments?.[idx]?.type} ${
        questionFunction?.arguments?.[idx]?.name
      }${curr.size ? `[${curr.size?.toString()}]` : ''} = ${curr.value};\n`;
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
  return `${nonInlineArgString}${buildFunctionString(
    questionFunction,
    functionArgsString
  )}`;
};
