import axios from 'axios';

export interface IRunSpec {
  language_id: string;
  sourcefilename: string;
  sourcecode: string;
}

export interface IRunParameters {
  run_spec: IRunSpec;
}

export const submitRun = async (
  runParameters: IRunParameters
): Promise<any> => {
  const config = {
    headers: {
      'Content-Type': 'application/json; charset-utf-8',
    },
  };
  const response = await axios.post(
    'https://code-runner-oxrju5up5q-ts.a.run.app/jobe/index.php/restapi/runs',
    runParameters,
    config
  );
  return response.data;
};
