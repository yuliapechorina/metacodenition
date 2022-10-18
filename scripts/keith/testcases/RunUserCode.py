import argparse
import datetime
import json

import requests

def parse_json(json_path):
    # open the file
    with open(json_path, 'r') as f:
        # read the file
        data = f.read()
        # convert to object
        obj = json.loads(data)
        # return the feedback
        return obj

def run_code(code: str):
    code_runner_url = 'https://code-runner-oxrju5up5q-ts.a.run.app/jobe/index.php/restapi/runs'
    response = requests.post(code_runner_url, json = {'run_spec': {'language_id': 'c', 'sourcefilename': 'test.c', 'sourcecode': code}}, headers = {'Content-Type': 'application/json; charset-utf-8'})
    return json.loads(response.text)

def construct_code(template, test_case, user_code):
    return template.replace('TEST_CASE', test_case).replace('STUDENT_CODE', user_code)

def run_question(solution, question):
    passed_ids = []
    failed_ids = []
    for test_case in question.get('testCases'):
        result = run_code(construct_code(question.get('codeTemplate'), test_case.get('main'), solution))
        if (result['stdout'] == test_case.get('expected')):
            passed_ids.append(test_case.get('id'))
        else:
            failed_ids.append(test_case.get('id'))
    return passed_ids, failed_ids

def main(user_questions_json_path, question_json_path):
    userObj = parse_json(user_questions_json_path)
    questionObj = parse_json(question_json_path)
    data = userObj['data']
    q1 = questionObj['questions'][0]
    q2 = questionObj['questions'][1]
    # print("UPI:", data[0].get('upi'), "User Group:", data[0].get('userGroup'), "\nQ1:\n", data[0].get('q1'), "\nQ2:\n", data[0].get('q2'))
    # print(run_code(construct_code(q1.get('codeTemplate'), q1.get('testCases')[0].get('main'), data[0].get('q1'))))

    for user in data:
        print("UPI:", user.get('upi'), "User Group:", user.get('userGroup'))
        passed_ids, failed_ids = run_question(user.get('q1'), q1)
        user['q1Passed'] = passed_ids
        user['q1Failed'] = failed_ids
        print("Q1:", "Passed:", passed_ids,"Failed:", failed_ids)
        passed_ids, failed_ids = run_question(user.get('q2'), q2)
        user['q2Passed'] = passed_ids
        user['q2Failed'] = failed_ids
        print("Q2", "Passed:", passed_ids,"Failed:", failed_ids)
    
    with open('output.json', 'w') as f:
        json.dump(userObj, f)
    
    print("Done")

if __name__ == '__main__':
    main('./bq_results.json', 'questions.json')
    