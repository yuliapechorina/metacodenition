import json
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
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

def main(slider_feedback_json_path):
    test_cases = parse_json(slider_feedback_json_path)
    groupA = test_cases['A']
    groupB = test_cases['B']

    q1A = sum(groupA.get("q1").values())
    q1B = sum(groupB.get("q1").values())
    q2A = sum(groupA.get("q2").values())
    q2B = sum(groupB.get("q2").values())

    labels = ["Question One", "Question Two"]
    q1Percent = [q1A / (groupA.get("users")*10)*100, q1B / (groupB.get("users")*10)*100]
    q2Percent = [q2A / (groupA.get("users")*12)*100, q2B / (groupB.get("users")*12)*100]

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
    ax.set_ylim(0, 25)

    ax.bar_label(rects1, padding=3, fmt='%.2f%%')
    ax.bar_label(rects2, padding=3, fmt='%.2f%%')

    fig.tight_layout()

    plt.show()

if __name__ == '__main__':
    main('./test_case_collated_results.json')
    