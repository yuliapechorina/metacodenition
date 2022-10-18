import argparse
import datetime
import json

def parse_users(json_path):
    # open the file
    with open(json_path, 'r') as f:
        # read the file
        data = f.read()
        # convert to object
        obj = json.loads(data)
        # return the feedback
        return obj

def get_average(vals):
    return round(sum(vals) / len(vals), 2)

def get_percentile(vals, percentile):
    return vals[int(len(vals) * (percentile/100))]

def main(json_path):
    userObj = parse_users(json_path)
    data = userObj['data']
    metadata = userObj['meta']

    creationTime = datetime.datetime.fromtimestamp(metadata['creationTime'])

    easiness_values = {}
    easiness_values["A"] = []
    easiness_values["B"] = []

    usefulness_values = {}
    usefulness_values["A"] = []
    usefulness_values["B"] = []

    intervention_counts = {}
    intervention_counts["A"] = {'testing': 0, 'understanding': 0, 'implementing': 0, 'evaluating': 0, 'designing': 0}
    intervention_counts["B"] = {'testing': 0, 'understanding': 0, 'implementing': 0, 'evaluating': 0, 'designing': 0}
    
    use_again_counts = {}
    use_again_counts["A"] = 0
    use_again_counts["B"] = 0

    feedback_counts = {}
    feedback_counts["A"] = 0
    feedback_counts["B"] = 0

    for userObjects in data:
        users = list(userObjects)
        for user in users:
            userGroup = userObjects[user].get('userGroup', False)
            if userGroup == False:
                continue
            lab: dict = userObjects[user]['lab08']
            # Feedback is a field inside of the lab object
            feedback = lab.get('feedback', False)
            if feedback == False:
                continue
            feedback_counts[userGroup] += 1
            easiness_values[userGroup].append(feedback['easiness'])
            usefulness_values[userGroup].append(feedback['usefulness'])
            intervention_counts[userGroup][feedback["intervention"]] += 1
            if feedback['useAgain']:
                use_again_counts[userGroup] += 1
    
    # sort the values
    easiness_values["T"] = [*easiness_values["A"], *easiness_values["B"]]
    easiness_values["A"].sort()
    easiness_values["B"].sort()

    usefulness_values["T"] = [*usefulness_values["A"], *usefulness_values["B"]]
    usefulness_values["A"].sort()
    usefulness_values["B"].sort()

    # Combine intervention_counts["A"] and intervention_counts["B"] into intervention_counts["T"]
    intervention_counts["T"] = {k: intervention_counts["A"][k] + intervention_counts["B"][k] for k in intervention_counts["A"]}

    print("############ FEEDBACK ANALYSIS ", creationTime, " ############")
    print("Number of datapoints")
    print("(A):\t\t", feedback_counts["A"])
    print("(B):\t\t", feedback_counts["B"])
    print("(TOTAL):\t", feedback_counts["A"] + feedback_counts["B"], "\n")

    print("Easiness", '\t', "average", '\t', "20%", '\t', "median", '\t', "80%", '\t', "min", '\t', "max")
    print("(A):\t\t", get_average(easiness_values["A"]), '\t\t', get_percentile(easiness_values["A"], 20), '\t', get_percentile(easiness_values["A"], 50), '\t\t', get_percentile(easiness_values["A"], 80), '\t', min(easiness_values["A"]), '\t', max(easiness_values["A"]))
    print("(B):\t\t", get_average(easiness_values["B"]), '\t\t', get_percentile(easiness_values["B"], 20), '\t', get_percentile(easiness_values["B"], 50), '\t\t', get_percentile(easiness_values["B"], 80), '\t', min(easiness_values["B"]), '\t', max(easiness_values["B"]))
    print("(TOTAL):\t", get_average(easiness_values["T"]), '\t\t', get_percentile(easiness_values["T"], 20), '\t', get_percentile(easiness_values["T"], 50), '\t\t', get_percentile(easiness_values["T"], 80), '\t', min(easiness_values["T"]), '\t', max(easiness_values["T"]), "\n")

    print("Usefulness", '\t', "average", '\t', "20%", '\t', "median", '\t', "80%", '\t', "min", '\t', "max")
    print("(A):\t\t", get_average(usefulness_values["A"]), '\t\t', get_percentile(usefulness_values["A"], 20), '\t', get_percentile(usefulness_values["A"], 50), '\t\t', get_percentile(usefulness_values["A"], 80), '\t', min(usefulness_values["A"]), '\t', max(usefulness_values["A"]))
    print("(B):\t\t", get_average(usefulness_values["B"]), '\t\t', get_percentile(usefulness_values["B"], 20), '\t', get_percentile(usefulness_values["B"], 50), '\t\t', get_percentile(usefulness_values["B"], 80), '\t', min(usefulness_values["B"]), '\t', max(usefulness_values["B"]))
    print("(TOTAL):\t", get_average(usefulness_values["T"]), '\t\t', get_percentile(usefulness_values["T"], 20), '\t', get_percentile(usefulness_values["T"], 50), '\t\t', get_percentile(usefulness_values["T"], 80), '\t', min(usefulness_values["T"]), '\t', max(usefulness_values["T"]), "\n")

    print("Best stage", '\t', "understanding", '\t', "designing", '\t', "evaluating", '\t', "implementing", '\t', "testing")
    print("(A):\t\t", intervention_counts["A"]["understanding"], "\t\t", intervention_counts["A"]["designing"], "\t\t", intervention_counts["A"]["evaluating"], "\t\t", intervention_counts["A"]["implementing"], "\t\t", intervention_counts["A"]["testing"])
    print("(B):\t\t", intervention_counts["B"]["understanding"], "\t\t", intervention_counts["B"]["designing"], "\t\t", intervention_counts["B"]["evaluating"], "\t\t", intervention_counts["B"]["implementing"], "\t\t", intervention_counts["B"]["testing"])
    print("(TOTAL):\t", intervention_counts["T"]["understanding"], "\t\t", intervention_counts["T"]["designing"], "\t\t", intervention_counts["T"]["evaluating"], "\t\t", intervention_counts["T"]["implementing"], "\t\t", intervention_counts["T"]["testing"], "\n")
    
    print("Use again (%)")
    print("(A):\t\t", round(use_again_counts["A"]*100 / feedback_counts["A"], 2))
    print("(B):\t\t", round(use_again_counts["B"]*100 / feedback_counts["B"], 2))
    print("(TOTAL):\t", round((use_again_counts["A"] + use_again_counts["B"])*100 / (feedback_counts["A"] + feedback_counts["B"]), 2), "\n")
    print("############ END OF FEEDBACK ANALYSIS ############")

if __name__ == '__main__':
  # get args from command line
    parser = argparse.ArgumentParser()
    parser.add_argument('--json', help='Path to user+assignment json file', required=True)

    args = parser.parse_args()
    main(args.json)
    