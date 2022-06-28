import { doc } from 'firebase/firestore';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ItemInterface } from 'react-sortablejs';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { Highlight } from '../pages/DesignPage/highlighter';
import useUpdate from '../hooks/useUpdate';
import useProblem from './ProblemContext';

export type ParsonsFragment = {
  listItem: ItemInterface;
  userGenerated: boolean;
};

interface IParsonsContext {
  parsonsFragments: ParsonsFragment[];
  submitParsons: () => void;
  isError: boolean;
  isLoading: boolean;
  getUnusedListItems: () => ItemInterface[];
  setUnusedListItems: (newState: ItemInterface[]) => void;
  getUnusedParsonsFragments: () => ParsonsFragment[];
  getUsedListItems: () => ItemInterface[];
  setUsedListItems: (newState: ItemInterface[]) => void;
  getUsedParsonsFragments: () => ParsonsFragment[];
}

const ParsonsContext = createContext<Partial<IParsonsContext>>({});

type ParsonsProviderProps = {
  children: ReactNode;
};

const defaultListItems: ItemInterface[] = [
  { id: 'default-1', action: 'Count Values' },
  { id: 'default-2', action: 'Parse Input' },
  { id: 'default-3', action: 'Map Values' },
  { id: 'default-4', action: 'Call a Function on Each' },
  { id: 'default-5', action: 'Create a Struct' },
  { id: 'default-6', action: 'Filter Values' },
  { id: 'default-7', action: 'Create a Helper Function' },
  { id: 'default-8', action: 'Perform a Calculation' },
  { id: 'default-9', action: 'Print an Output' },
];

const getIdsFromFragments = (fragments: ParsonsFragment[]) =>
  fragments.map<string | number>((fragment) => fragment.listItem.id);

const getIdsFromItems = (items: ItemInterface[]) =>
  items.map<string | number>((item) => item.id);

const generateUnusedIds = (
  usedIds: (string | number)[],
  allIds: (string | number)[]
) => allIds.filter((id) => !usedIds.includes(id));

const defaultParsonsFragments = defaultListItems.map<ParsonsFragment>(
  (listItem) => ({ listItem, userGenerated: false })
);

const generateUserFragments = (highlights: Highlight[]) =>
  highlights.map<ParsonsFragment>((highlight: Highlight) => ({
    listItem: { id: `user-${highlight.id}`, action: highlight.action },
    userGenerated: true,
  }));

export const ParsonsProvider = (props: ParsonsProviderProps) => {
  const { children } = props;

  const [user] = useAuthState(auth);
  const userDoc = user ? doc(db, 'users', user!.uid) : undefined;
  const [userData] = useDocumentData(userDoc);
  const { isLoading, isError, updateDocument } = useUpdate();

  const { highlights } = useProblem();

  const userParsonsFragments = generateUserFragments(highlights || []);

  const [parsonsFragments] = useState<ParsonsFragment[]>(
    userParsonsFragments.concat(defaultParsonsFragments)
  );

  const [unusedIds, setUnusedIds] = useState<(string | number)[]>(
    getIdsFromFragments(userParsonsFragments.concat(defaultParsonsFragments))
  );
  const [usedIds, setUsedIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (userData && userData.usedParsonsIds) {
      setUsedIds(userData.usedParsonsIds);
      setUnusedIds(
        generateUnusedIds(
          userData.usedParsonsIds,
          getIdsFromFragments(parsonsFragments)
        )
      );
    }
  }, [userData, highlights, parsonsFragments]);

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

  const context = useMemo(
    () => ({
      parsonsFragments,
      submitParsons,
      isError,
      isLoading,
      getUnusedListItems,
      setUnusedListItems,
      getUnusedParsonsFragments,
      getUsedListItems,
      setUsedListItems,
      getUsedParsonsFragments,
    }),
    [parsonsFragments, isError, isLoading, user, userData, unusedIds, usedIds]
  );

  return (
    <ParsonsContext.Provider value={context}>
      {children}
    </ParsonsContext.Provider>
  );
};

const useParsons = () => useContext(ParsonsContext);

export default useParsons;
