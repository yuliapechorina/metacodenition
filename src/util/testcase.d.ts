export type ResultType = 'pass' | 'fail' | 'unrun';

export interface IArgument {
  inline?: boolean;
  type?: string;
  name?: string;
  value?: string;
  size?: number;
}

export interface ITestCase {
  id: string;
  input: IArgument[];
  expected: string;
  output?: string;
  solved?: boolean;
  result?: ResultType;
  returnValue?: boolean;
  student_generated?: boolean;
}

export interface IFunction {
  arguments?: IArgument[];
  name?: string;
  returnType?: string;
}
