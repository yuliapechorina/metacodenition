from functools import reduce
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

interventions_map = {
    "understanding": "Understanding\nthe Problem",
    "designing": "Designing\na Solution",
    "evaluating": "Evaluating\nthe Solution",
    "implementing": "Implementing\na Solution",
    "testing": "Evaluating\nImplemented Solution"
}

def accumulate_interventions(acc, intervention):
    intervention_name = interventions_map[intervention]
    if intervention_name in acc:
        acc[intervention_name] += 1
    else:
        acc[intervention_name] = 1
    return acc

def main(slider_feedback_json_path):
    feedback = parse_json(slider_feedback_json_path)
    data = feedback['data']
    filtered_data = filter(lambda x: x.get('favourite_intervention') is not None, data)
    favourite_interventions_list = list(map(lambda x: x.get('favourite_intervention'), filtered_data))
    empty_interventions_dict = {"Understanding\nthe Problem": 0, "Designing\na Solution": 0, "Evaluating\nthe Solution": 0, "Implementing\na Solution": 0, "Evaluating\nImplemented Solution": 0}
    favourite_interventions = reduce(accumulate_interventions, favourite_interventions_list, empty_interventions_dict)

    plt.style.context('grayscale')
    plt.style.use('grayscale')
    fig, ax = plt.subplots(1, 1, figsize=(10, 5), facecolor='white')
    
    ax.bar(favourite_interventions.keys(), height=favourite_interventions.values(), linewidth=1.2)
    ax.set_title("Students' Preferred Intervention")

    ax.set_ylabel("Number of Students")
    ax.set_ylim(0, 250)
    ax.set_box_aspect(0.5)
    ax.grid(True, linestyle='-.')
    ax.set_axisbelow(True)

    plt.show()

if __name__ == '__main__':
    main('./feedback-1145-12-10-22.json')
    