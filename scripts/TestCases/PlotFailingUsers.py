from functools import reduce
import json
from matplotlib import pyplot as plt
import numpy as np

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
    total_users = len(data)
    users_a = reduce(lambda acc, user: acc + 1 if user.get("userGroup") == 'A' else acc, data, 0)
    failing_users_a_q1 = reduce(lambda acc, user: acc + 1 if user.get("userGroup") == 'A' and len(user.get("q1Failed")) > 0 else acc, data, 0)
    failing_users_a_q2 = reduce(lambda acc, user: acc + 1 if user.get("userGroup") == 'A' and len(user.get("q2Failed")) > 0 else acc, data, 0)
    users_b = reduce(lambda acc, user: acc + 1 if user.get("userGroup") == 'B' else acc, data, 0)
    failing_users_b_q1 = reduce(lambda acc, user: acc + 1 if user.get("userGroup") == 'B' and len(user.get("q1Failed")) > 0 else acc, data, 0)
    failing_users_b_q2 = reduce(lambda acc, user: acc + 1 if user.get("userGroup") == 'B' and len(user.get("q2Failed")) > 0 else acc, data, 0)
    print(f"Total Users: {total_users}")
    print(f"Users in Group A: {users_a}")
    print(f"Failing Users in Group A Q1: {failing_users_a_q1}")
    print(f"Failing Users in Group A Q2: {failing_users_a_q2}")
    print(f"Users in Group B: {users_b}")
    print(f"Failing Users in Group B Q1: {failing_users_b_q1}")
    print(f"Failing Users in Group B Q2: {failing_users_b_q2}")
    print("\n")
    print(f"Percentage of Failing Users in Group A Q1: {failing_users_a_q1 / users_a * 100}%")
    print(f"Percentage of Failing Users in Group B Q1: {failing_users_b_q1 / users_b * 100}%")
    print(f"Percentage of Failing Users in Group A Q2: {failing_users_a_q2 / users_a * 100}%")
    print(f"Percentage of Failing Users in Group B Q2: {failing_users_b_q2 / users_b * 100}%")

    labels = ["Question One", "Question Two"]
    q1Percent = [failing_users_a_q1 / users_a * 100, failing_users_a_q2 / users_a * 100]
    q2Percent = [failing_users_b_q1 / users_b * 100, failing_users_b_q2 / users_b * 100]

    x = np.arange(len(labels))  # the label locations
    width = 0.35  # the width of the bars

    plt.style.context('grayscale')
    plt.style.use('grayscale')
    fig, ax = plt.subplots(1, 1, figsize=(10, 5), facecolor='white')
    
    rects1 = ax.bar(x - width/2, q1Percent, width, label='Group A')
    rects2 = ax.bar(x + width/2, q2Percent, width, label='Group B')

    ax.set_title("Test Case Failure Rate by Question and User Group")

    ax.set_ylabel("Failure Rate (%)")
    ax.set_box_aspect(0.5)
    ax.grid(True, linestyle='-.')
    ax.set_axisbelow(True)
    ax.set_xticks(x, labels)
    ax.legend()
    ax.set_ylim(0, 35)

    ax.bar_label(rects1, padding=3, fmt='%.2f%%')
    ax.bar_label(rects2, padding=3, fmt='%.2f%%')

    fig.tight_layout()

    plt.show()

if __name__ == '__main__':
    main('./output.json')
    