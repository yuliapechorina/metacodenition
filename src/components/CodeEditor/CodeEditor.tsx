import { Stack, Tabs } from '@mantine/core';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import useCode from '../../context/CodeContext';

type CodeEditorProps = {
  className?: string;
};

const CodeEditor = (props: CodeEditorProps) => {
  const { className } = props;

  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const { files, editFile } = useCode();

  const handleFileEdit = (content?: string) => {
    editFile!(files![activeFileIndex].id, content!);
  };

  return (
    <Stack className='overflow-hidden'>
      <Tabs
        active={activeFileIndex}
        onTabChange={setActiveFileIndex}
        variant='outline'
        classNames={{ body: `${className}`, root: 'flex flex-col' }}
        key={activeFileIndex}
      >
        {files?.map((file) => (
          <Tabs.Tab label={file.name} key={file.id} />
        ))}
      </Tabs>
      <Editor
        theme='vs'
        language='c'
        value={files?.[activeFileIndex].content}
        className='shrink'
        onChange={handleFileEdit}
      />
    </Stack>
  );
};

CodeEditor.defaultProps = { className: '' };

export default CodeEditor;
