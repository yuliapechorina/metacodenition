import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../util/firebase';

const useUpdate = () => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const updateDocument = async (
    collectionName: string,
    documentId: string,
    data: { [x: string]: any }
  ) => {
    setLoading(true);
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data)
      .then(() => {
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  return { isLoading, isError, updateDocument };
};

export default useUpdate;
