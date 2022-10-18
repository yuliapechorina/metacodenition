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
    feedback = parse_json(slider_feedback_json_path)
    data = feedback['data']
    usefulness_values = []
    easiness_values = []
    for user in data:
        usefulness = user.get('usefulness')
        if (usefulness is not None):
            usefulness_values.append(int(usefulness)/20)
        easiness = user.get('easiness')
        if (easiness is not None):
            easiness_values.append(int(easiness)/20)
    
    usefulness_values = sorted(usefulness_values)
    easiness_values = sorted(easiness_values)

    plt.style.context('grayscale')
    plt.style.use('grayscale')
    fig, axs = plt.subplots(1, 2, figsize=(10, 5), facecolor='white')
    
    axs[0].hist(easiness_values, bins=5, linewidth=1.2)
    axs[0].set_title("Easiness")

    axs[1].hist(usefulness_values, bins=5, linewidth=1.2)
    axs[1].set_title("Usefulness")

    for ax in axs:
        ax.set_xlabel("Student Rating (0-5)")
        ax.set_ylabel("Number of Student")
        ax.set_ylim(0, 250)
        ax.set_box_aspect(1)
        ax.grid(True, linestyle='-.')
        ax.set_axisbelow(True)

    plt.show()

if __name__ == '__main__':
    main('./feedback-1145-12-10-22.json')
    