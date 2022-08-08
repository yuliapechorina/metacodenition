import { useEffect, useState } from 'react';
import useAssignment from '../context/AssignmentContext';
import useNotifications from '../context/NotificationContext';

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

const useInterventions = () => {
  const { userAssignmentDocData, updateUserAssignmentDoc, isLoading, isError } =
    useAssignment();
  const [interventions, setInterventions] = useState<IIntervention[]>([]);

  useEffect(() => {
    if (userAssignmentDocData !== undefined) {
      if (userAssignmentDocData.interventions !== undefined) {
        setInterventions(userAssignmentDocData.interventions);
      } else {
        updateUserAssignmentDoc!({ interventions: defaultInterventions });
      }
    }
  }, [userAssignmentDocData]);

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
