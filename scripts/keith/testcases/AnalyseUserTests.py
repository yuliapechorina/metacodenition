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

def main(user_questions_json_path):
    userObj = parse_json(user_questions_json_path)
    data = userObj['data']
    failures = {"A": {"q1": {}, "q2": {}, "users": 0}, "B": {"q1": {}, "q2": {}, "users": 0}}
    for user in data:
        user_group = user.get("userGroup")
        failures[user_group]["users"] += 1
        failed_test_cases = user.get("q1Failed")
        if (failed_test_cases is not None and len(failed_test_cases) > 0):
            for failed_test_case in failed_test_cases:
                if failed_test_case in failures[user_group]['q1']:
                    failures[user_group]['q1'][failed_test_case] += 1
                else:
                    failures[user_group]['q1'][failed_test_case] = 1
        failed_test_cases = user.get("q2Failed")
        if (failed_test_cases is not None and len(failed_test_cases) > 0):
            for failed_test_case in failed_test_cases:
                if failed_test_case in failures[user_group]['q2']:
                    failures[user_group]['q2'][failed_test_case] += 1
                else:
                    failures[user_group]['q2'][failed_test_case] = 1
    print(failures)
    percent_failed = {"A": {"q1": {}, "q2": {}}, "B": {"q1": {}, "q2": {}}}
    number_of_test_cases = {"q1": 10, "q2": 12}
    for user_group in failures:
        total_failures = 0
        for test_case in failures[user_group]["q1"]:
            total_failures += failures[user_group]["q1"][test_case]
        percent_failed[user_group]["q1"] = total_failures / (failures[user_group]["users"] * number_of_test_cases["q1"]) * 100
        total_failures = 0
        for test_case in failures[user_group]["q2"]:
            total_failures += failures[user_group]["q2"][test_case]
        percent_failed[user_group]["q2"] = total_failures / (failures[user_group]["users"] * number_of_test_cases["q2"]) * 100
    print(percent_failed)

if __name__ == '__main__':
    main('./output.json')
    