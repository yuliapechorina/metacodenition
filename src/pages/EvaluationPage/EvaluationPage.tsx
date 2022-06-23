import { Button, Card, Group, Stack, Title } from '@mantine/core';
import { arrayUnion, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { ReactSortable, ItemInterface } from 'react-sortablejs';
import useProblem from '../../context/ProblemContext';
import { auth, db } from '../../firebase';
import useUpdate from '../../hooks/useUpdate';
import { Highlight } from '../DesignPage/highlighter';

type ParsonsFragment = {
  listItem: ItemInterface;
  userGenerated: boolean;
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

// const defaultUsedIds: (string | number)[] = ['default-3', 'user-1'];

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

const getListItems = (fragments: ParsonsFragment[]) =>
  fragments.map<ItemInterface>((fragment) => fragment.listItem);

const EvaluationPage = () => {
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

  const handleSubmitAction = () => {
    if (!getIdsFromItems(getUsedListItems())) {
      return;
    }

    if (user) {
      updateDocument('users', user.uid, {
        usedParsonsIds: getIdsFromItems(getUsedListItems()),
      });
    }
    // console.log(getIdsFromItems(getUsedListItems()));
  };

  return (
    <Stack className='h-full pt-8 pb-20'>
      <Group className='h-fit overflow-auto'>
        <Stack className='h-full flex-1'>
          <Title className='text-center'>Drag from here</Title>
          <ReactSortable
            list={getUnusedListItems()}
            setList={setUnusedListItems}
            group='design-parsons'
            animation={100}
            className='flex flex-col space-y-8 h-full p-4 m-4 rounded-md'
          >
            {getUnusedParsonsFragments().map((fragment) => (
              <div key={fragment.listItem.id}>
                <Card
                  shadow='sm'
                  p='lg'
                  className={`bg-gray-100 cursor-grab h-fit${
                    fragment.userGenerated && ' font-bold'
                  }`}
                >
                  {fragment.listItem.action}
                </Card>
              </div>
            ))}
          </ReactSortable>
        </Stack>
        <Stack className='h-full flex-1'>
          <Title className='text-center'>Drop in here</Title>
          <ReactSortable
            list={getListItems(getUsedParsonsFragments())}
            setList={setUsedListItems}
            group='design-parsons'
            animation={100}
            className='flex flex-col space-y-8 h-full p-4 m-4 rounded-md'
          >
            {getUsedParsonsFragments().map((fragment) => (
              <div key={fragment.listItem.id}>
                <Card
                  shadow='sm'
                  p='lg'
                  className={`bg-gray-100 cursor-grab h-fit${
                    fragment.userGenerated && ' font-bold'
                  }`}
                >
                  {fragment.listItem.action}
                </Card>
              </div>
            ))}
          </ReactSortable>
        </Stack>
      </Group>
      <Button
        size='md'
        className='bg-emerald-500 fill-emerald-50 hover:bg-emerald-600 w-fit m-auto'
        onClick={handleSubmitAction}
        disabled={isLoading}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default EvaluationPage;
