import { Comment, File } from '../context/CodeContext';

const getOutput = (getComments: () => Comment[], file: File) => {
  const newComments = getComments();
  const newCommentIds = newComments.map((nC) => nC.id);
  const duplicateComments =
    file.comments?.filter((c) => newCommentIds.includes(c.id)) || [];
  const usedCommentIds: (string | number)[] = [];

  const newContentArray = file.content.split('\n');
  duplicateComments.forEach((c) => {
    const newText = newComments.find((nC) => nC.id === c.id)?.text;
    const commentIndex = newContentArray.findIndex((s) => s === c.text);
    if (newText !== undefined && newContentArray[commentIndex] !== undefined) {
      newContentArray[commentIndex] = newText;
      usedCommentIds.push(c.id);
    }
  });

  const commentBlock = newComments
    ?.filter((nC) => !usedCommentIds.includes(nC.id))
    .reduce((s, c) => `${s + c.text}\n`, '');
  if (commentBlock)
    newContentArray.splice(
      newContentArray.findIndex((s) => s.includes('{')) + 1,
      0,
      commentBlock
    );
  const newContent = newContentArray.join('\n');

  const generatorOutput = {
    newContent,
    newComments,
    commentsGenerated: newComments.length,
    commentsUpdated: usedCommentIds.length,
  };
  return generatorOutput;
};

export default getOutput;
