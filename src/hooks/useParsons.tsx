import { doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ItemInterface } from 'react-sortablejs';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../util/firebase';
import { Highlight } from '../util/highlighter';
import useUpdate from './useUpdate';

export type ParsonsFragment = {
  listItem: ItemInterface;
  userGenerated: boolean;
};

const getIdsFromFragments = (fragments: ParsonsFragment[]) =>
  fragments.map<string | number>((fragment) => fragment.listItem.id);

const getIdsFromItems = (items: ItemInterface[]) =>
  items.map<string | number>((item) => item.id);

const generateUnusedIds = (
  usedIds: (string | number)[],
  allIds: (string | number)[]
) => allIds.filter((id) => !usedIds.includes(id));

const generateDefaultFragments = (defaultListItems: ItemInterface[]) =>
  defaultListItems.map<ParsonsFragment>((listItem) => ({
    listItem,
    userGenerated: false,
  }));

const generateUserFragments = (highlights: Highlight[]) =>
  highlights.map<ParsonsFragment>((highlight: Highlight) => ({
    listItem: { id: `user-${highlight.id}`, action: highlight.action },
    userGenerated: true,
  }));

const useParsons = () => {
  const [user] = useAuthState(auth);
  const userDoc = user ? doc(db, 'users', user!.uid) : undefined;
  const questionDoc = user
    ? doc(db, 'questions', 'wIK4Zf2d0ZKLpnnzsfxp')
    : undefined;
  const [userData] = useDocumentData(userDoc);
  const [questionData] = useDocumentData(questionDoc);
  const { isLoading, isError, updateDocument } = useUpdate();

  const [parsonsFragments, setParsonsFragments] = useState<ParsonsFragment[]>(
    []
  );

  const [unusedIds, setUnusedIds] = useState<(string | number)[]>(
    getIdsFromFragments([])
  );
  const [usedIds, setUsedIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (userData && userData.usedParsonsIds && questionData) {
      const newDefaultListItems =
        (questionData.defaultListItems as ItemInterface[]) || [];
      const newUserFragments = generateUserFragments(
        userData.highlights ? userData.highlights : []
      );
      const newParsonsFragments = newUserFragments.concat(
        generateDefaultFragments(newDefaultListItems)
      );
      const newIds = getIdsFromFragments(newParsonsFragments);
      const newUsedIds = userData.usedParsonsIds;
      const newUnusedIds = generateUnusedIds(newUsedIds, newIds);
      setParsonsFragments(newParsonsFragments);
      setUsedIds(newUsedIds);
      setUnusedIds(newUnusedIds);
    }
    if (user && userData && !userData?.usedParsonsIds.length) {
      updateDocument('users', user.uid, {
        usedParsonsIds: getIdsFromItems([]),
      });
    }
  }, [userData, questionData]);

  const getItemsFromIds = (ids: (string | number)[]) =>
    ids
      .map(
        (id) =>
          parsonsFragments.find((fragment) => fragment.listItem.id === id)
            ?.listItem
      )
      .filter((item) => item) as ItemInterface[];

  const getUnusedListItems = () => getItemsFromIds(unusedIds);

  const getUsedListItems = () => getItemsFromIds(usedIds);

  const getFragmentsFromItems = (items: ItemInterface[]) =>
    items
      .map((item) =>
        parsonsFragments.find((fragment) => fragment.listItem === item)
      )
      .filter((item) => item) as ParsonsFragment[];

  const getUnusedParsonsFragments = (): ParsonsFragment[] =>
    getFragmentsFromItems(getUnusedListItems());

  const getUsedParsonsFragments = (): ParsonsFragment[] =>
    getFragmentsFromItems(getUsedListItems());

  const setUnusedListItems = (newState: ItemInterface[]) =>
    setUnusedIds(getIdsFromItems(newState));

  const setUsedListItems = (newState: ItemInterface[]) =>
    setUsedIds(getIdsFromItems(newState));

  const submitParsons = () => {
    if (!getIdsFromItems(getUsedListItems())) {
      return;
    }

    if (user) {
      updateDocument('users', user.uid, {
        usedParsonsIds: getIdsFromItems(getUsedListItems()),
      });
    }
  };

  return {
    submitParsons,
    isError,
    isLoading,
    getUnusedListItems,
    setUnusedListItems,
    getUnusedParsonsFragments,
    getUsedListItems,
    setUsedListItems,
    getUsedParsonsFragments,
  };
};

export default useParsons;
