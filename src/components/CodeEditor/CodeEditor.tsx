import { Stack, Tabs } from '@mantine/core';
import Editor from '@monaco-editor/react';
import React, { useState } from 'react';

type CodeEditorProps = {
  className?: string;
};

type File = {
  id: number;
  name: string;
  content: string;
};

const CodeEditor = (props: CodeEditorProps) => {
  const { className } = props;

  const [activeFileId, setActiveFileId] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([
    {
      id: 0,
      name: 'main.c',
      content: '// Enter your main code here',
    },
    {
      id: 1,
      name: 'main.h',
      content: '// Enter your header code here',
    },
  ]);

  const handleFileEdit = (id: number, content?: string) => {
    if (!content) {
      return;
    }

    const newFiles: File[] = files.map((file) => {
      if (file.id === id) {
        return {
          ...file,
          content,
        };
      }

      return file;
    });

    setFiles(newFiles);
  };

  return (
    <Stack className='overflow-hidden'>
      <Tabs
        active={activeFileId}
        onTabChange={setActiveFileId}
        variant='outline'
        classNames={{ body: `${className}`, root: 'flex flex-col' }}
        key={activeFileId}
      >
        {files?.map((file) => (
          <Tabs.Tab label={file.name} key={file.id} />
        ))}
      </Tabs>
      <Editor
        theme='vs'
        language='c'
        value={files.filter((file) => file.id === activeFileId)[0].content}
        className='shrink'
        onChange={(newContent) => handleFileEdit(activeFileId, newContent)}
      />
    </Stack>
  );
};

CodeEditor.defaultProps = { className: '' };

export default CodeEditor;
