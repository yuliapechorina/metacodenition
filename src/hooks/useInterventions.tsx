import { useEffect, useState } from 'react';
import useAssignment from '../context/AssignmentContext';
import useNotifications from '../context/NotificationContext';
import useUser from './useUser';

type IIntervention = {
  name: string;
  enabled: boolean;
};

const defaultInterventions = [
  {
    name: 'Understanding the problem',
    enabled: true,
  },
  {
    name: 'Designing a solution',
    enabled: true,
  },
  {
    name: 'Evaluating a solution',
    enabled: true,
  },
  {
    name: 'Evaluating implemented solution',
    enabled: true,
  },
];

const noInterventions = defaultInterventions.map((intervention) => ({
  ...intervention,
  enabled: false,
}));

const useInterventions = () => {
  const {
    userAssignmentDocData,
    updateUserAssignmentDoc,
    isLoading,
    isError,
    questionNumber,
    questionsLength,
    abTestingEnabled,
  } = useAssignment();
  const [interventions, setInterventions] = useState<IIntervention[]>([]);
  const { userData } = useUser();
  const userGroup = userData?.userGroup;

  useEffect(() => {
    if (userAssignmentDocData !== undefined) {
      if (userAssignmentDocData.interventions !== undefined) {
        const isLastQuestion = (questionsLength ?? 3) === (questionNumber ?? 0);
        const questionIsEven = (questionNumber ?? 0) % 2 === 0;
        const questionIsOdd = (questionNumber ?? 0) % 2 === 1;

        if (isLastQuestion) {
          setInterventions(userAssignmentDocData.interventions);
        } else if (abTestingEnabled && userGroup === 'A' && questionIsEven) {
          setInterventions(noInterventions);
        } else if (abTestingEnabled && userGroup === 'B' && questionIsOdd) {
          setInterventions(noInterventions);
        } else {
          setInterventions(defaultInterventions);
        }
      } else {
        updateUserAssignmentDoc!({ interventions: defaultInterventions });
      }
    }
  }, [userAssignmentDocData, questionNumber, questionsLength, userGroup]);

  const toggleInterventionEnabled = (name: string) => {
    const newInterventions = interventions.map((intervention) => {
      if (intervention.name === name) {
        return { ...intervention, enabled: !intervention.enabled };
      }
      return intervention;
    });
    updateUserAssignmentDoc!({ interventions: newInterventions });
  };

  const setUserInterventions = (userInterventions: IIntervention[]) => {
    updateUserAssignmentDoc!({ interventions: userInterventions });
  };

  const { addNotification } = useNotifications();
  useEffect(() => {
    if (isError) {
      addNotification!({
        type: 'failure',
        content: 'Error loading intervention data',
      });
    }
  }, [isError]);

  return {
    interventions,
    toggleInterventionEnabled,
    setUserInterventions,
    isLoading,
    isError,
  };
};

export default useInterventions;
