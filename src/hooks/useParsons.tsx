import { useEffect, useState } from 'react';
import { ItemInterface } from 'react-sortablejs';
import useAssignment from '../context/AssignmentContext';
import { Highlight } from '../util/highlighter';
import useQuestion from './useQuestion';

export type ParsonsFragment = {
  listItem: ItemInterface;
  userGenerated?: boolean;
};

const getIdsFromFragments = (fragments: ParsonsFragment[]) =>
  fragments.map<string | number>((fragment) => fragment.listItem.id);

const getIdsFromItems = (items: ItemInterface[]) =>
  items.map<string | number>((item) => item.id);

const generateUnusedIds = (
  usedIds: (string | number)[],
  allIds: (string | number)[]
) => allIds.filter((id) => !usedIds.includes(id));

const generateHighlightFragments = (highlights: Highlight[]) =>
  highlights
    .filter((hl) => hl.action)
    .map<ParsonsFragment>((highlight: Highlight) => ({
      listItem: { id: highlight.id, action: highlight.action },
      userGenerated: true,
    }));

const useParsons = () => {
  const { setUnsavedChanges } = useAssignment();
  const {
    highlights,
    actions,
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
    const newHighlightFragments = generateHighlightFragments(highlights || []);
    const newParsonsFragments = newHighlightFragments.concat(actions);
    const newIds = getIdsFromFragments(newParsonsFragments);
    const newUsedIds = usedParsonsIds;
    const newUnusedIds =
      newUsedIds !== undefined && newIds !== undefined
        ? generateUnusedIds(newUsedIds, newIds)
        : [];
    setParsonsFragments(newParsonsFragments);
    setUsedIds(newUsedIds);
    setUnusedIds(newUnusedIds);
  }, [actions, highlights]);

  useEffect(() => {
    const sameLength = usedParsonsIds.length === usedIds.length;
    const allInParsonsListInOrder = usedParsonsIds.every(
      (id, index) => usedIds[index] === id
    );
    setUnsavedChanges!(!sameLength || !allInParsonsListInOrder);
  }, [usedIds, usedParsonsIds]);

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

  const setUnusedListItems = (newState: ItemInterface[]) => {
    setUnusedIds(getIdsFromItems(newState));
  };

  const setUsedListItems = (newState: ItemInterface[]) => {
    setUsedIds(getIdsFromItems(newState));
  };

  const submitParsons = () => {
    if (!getIdsFromItems(getUsedListItems())) {
      return;
    }

    updateUserQuestionDocument({
      usedParsonsIds: getIdsFromItems(getUsedListItems()),
    });
  };

  const addAction = (action: ItemInterface) => {
    updateUserQuestionDocument({
      actions: [...actions, { listItem: action }],
    });
  };

  const editFragment = (fragment: ParsonsFragment) => {
    // Check if the fragment is a highlight
    const highlight = highlights?.find((hl) => hl.id === fragment.listItem.id);
    if (highlight) {
      updateUserQuestionDocument({
        highlights: highlights.map((hl) =>
          hl.id === highlight.id
            ? { ...hl, action: fragment.listItem.action }
            : hl
        ),
      });
    } else {
      updateUserQuestionDocument({
        actions: actions.map((action) =>
          action.listItem.id === fragment.listItem.id
            ? { listItem: fragment.listItem }
            : action
        ),
      });
    }
  };

  const deleteFragment = (fragment: ParsonsFragment) => {
    // Check if the fragment is a highlight
    const highlight = highlights?.find((hl) => hl.id === fragment.listItem.id);
    if (highlight) {
      updateUserQuestionDocument({
        highlights: highlights.map((hl: Highlight) =>
          hl.id === highlight.id ? { ...hl, action: '' } : hl
        ),
      });
    } else {
      updateUserQuestionDocument({
        actions: actions.filter(
          (action) => action.listItem.id !== fragment.listItem.id
        ),
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
    addAction,
    editFragment,
    deleteFragment,
  };
};

export default useParsons;
