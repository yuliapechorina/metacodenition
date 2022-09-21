import argparse
import datetime
import json

def parse_feedback(json_path):
    # open the file
    with open(json_path, 'r') as f:
        # read the file
        data = f.read()
        # convert to object
        obj = json.loads(data)
        # return the feedback
        return obj

def main(json_path):
    feedbackObj = parse_feedback(json_path)
    feedback = feedbackObj['data']
    metadata = feedbackObj['meta']
    creationTime = datetime.datetime.fromtimestamp(metadata['creationTime'])
    easiness_values = []
    usefulness_values = []
    intervention_counts = {'testing': 0, 'understanding': 0, 'implementing': 0, 'evaluating': 0, 'designing': 0}
    use_again_count = 0

    for userFeedback in feedback:
        keys = list(userFeedback)
        for key in keys:
            easiness_values.append(userFeedback[key]['easiness'])
            usefulness_values.append(userFeedback[key]['usefulness'])
            intervention_counts[userFeedback[key]["intervention"]] += 1
            if userFeedback[key]['useAgain']:
                use_again_count += 1
    
    # sort the values
    easiness_values.sort()
    usefulness_values.sort()

    # sort the intervention counts
    intervention_counts = dict(sorted(intervention_counts.items(), key=lambda item: item[1], reverse=True))



    print("############ FEEDBACK ANALYSIS ", creationTime, " ############")
    print("Number of datapoints: ", len(feedback), "\n")
    # print average, 20%, median, 80%, min, max of easiness and usefulness
    print("Easiness average: ", sum(easiness_values) / len(easiness_values))
    print("Easiness 20%: ", easiness_values[int(len(easiness_values) * 0.2)])
    print("Easiness median: ", easiness_values[int(len(easiness_values) / 2)])
    print("Easiness 80%: ", easiness_values[int(len(easiness_values) * 0.8)])
    print("Easiness min: ", min(easiness_values))
    print("Easiness max: ", max(easiness_values), "\n")
    print("Usefulness average: ", sum(usefulness_values) / len(usefulness_values))
    print("Usefulness 20%: ", usefulness_values[int(len(usefulness_values) * 0.2)])
    print("Usefulness median: ", usefulness_values[int(len(usefulness_values) / 2)])
    print("Usefulness 80%: ", usefulness_values[int(len(usefulness_values) * 0.8)])
    print("Usefulness min: ", min(usefulness_values))
    print("Usefulness max: ", max(usefulness_values), "\n")
    print("Favourite ntervention counts: ", intervention_counts, "\n")
    print("Use again: ", use_again_count * 100 / len(feedback), "%\n")
    print("############ END OF FEEDBACK ANALYSIS ############")

if __name__ == '__main__':
  # get args from command line
    parser = argparse.ArgumentParser()
    parser.add_argument('--json', help='Path to feedback json file', required=True)

    args = parser.parse_args()
    main(args.json)
    