import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import useNotifications from '../context/NotificationContext';
import { auth, db } from '../util/firebase';

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
  const [interventions, setInterventions] = useState<IIntervention[]>([]);

  const [user] = useAuthState(auth);
  const userDoc = user ? doc(db, 'users', user.uid) : undefined;
  const [userDocumentData, loading, error] = useDocumentData(userDoc);

  useEffect(() => {
    if (userDocumentData !== undefined) {
      if (userDocumentData.interventions !== undefined) {
        setInterventions(userDocumentData.interventions);
      } else if (userDoc) {
        updateDoc(userDoc, { interventions: defaultInterventions });
      }
    }
  }, [userDocumentData]);

  const toggleInterventionEnabled = (name: string) => {
    if (userDoc) {
      const newInterventions = interventions.map((intervention) => {
        if (intervention.name === name) {
          return { ...intervention, enabled: !intervention.enabled };
        }
        return intervention;
      });
      updateDoc(userDoc, { interventions: newInterventions });
    }
  };

  const setUserInterventions = (userInterventions: IIntervention[]) => {
    if (userDoc) {
      updateDoc(userDoc, { interventions: userInterventions });
    }
  };

  const { addNotification } = useNotifications();
  useEffect(() => {
    if (error) {
      addNotification!({
        type: 'failure',
        content: 'Error loading intervention data',
      });
    }
  }, [error]);

  return {
    interventions,
    toggleInterventionEnabled,
    setUserInterventions,
    loading,
    error,
  };
};

export default useInterventions;
