import { useEffect, useState } from 'react';
import { ItemInterface } from 'react-sortablejs';
import { Highlight } from '../util/highlighter';
import useQuestion from './useQuestion';

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
  const {
    defaultListItems,
    highlights,
    usedParsonsIds,
    isLoading,
    isError,
    updateUserQuestionDocument,
  } = useQuestion();

  const [parsonsFragments, setParsonsFragments] = useState<ParsonsFragment[]>(
    []
  );

  const [unusedIds, setUnusedIds] = useState<(string | number)[]>(
    getIdsFromFragments([])
  );
  const [usedIds, setUsedIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    const newDefaultListItems = (defaultListItems as ItemInterface[]) || [];
    const newUserFragments = generateUserFragments(highlights || []);
    const newParsonsFragments = newUserFragments.concat(
      generateDefaultFragments(newDefaultListItems)
    );
    const newIds = getIdsFromFragments(newParsonsFragments);
    const newUsedIds = usedParsonsIds;
    const newUnusedIds =
      newUsedIds !== undefined && newIds !== undefined
        ? generateUnusedIds(newUsedIds, newIds)
        : [];
    setParsonsFragments(newParsonsFragments);
    setUsedIds(newUsedIds);
    setUnusedIds(newUnusedIds);
  }, [defaultListItems, highlights]);

  const getItemsFromIds = (ids: (string | number)[]) =>
    ids
      ? (ids
          .map(
            (id) =>
              parsonsFragments.find((fragment) => fragment.listItem.id === id)
                ?.listItem
          )
          .filter((item) => item) as ItemInterface[])
      : [];

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

    updateUserQuestionDocument({
      usedParsonsIds: getIdsFromItems(getUsedListItems()),
    });
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
