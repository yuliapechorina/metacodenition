import { Tabs } from '@mantine/core';
import Editor from '@monaco-editor/react';
import React, { useState } from 'react';

const CodeEditor = (props: { className?: string }) => {
  const { className } = props;
  const tabNames = ['main.c', 'main.h'];
  const [activeTab, setActiveTab] = useState(1);

  return (
    <Tabs
      active={activeTab}
      onTabChange={setActiveTab}
      variant='outline'
      classNames={{ body: className, root: `flex flex-col ${className}` }}
    >
      {tabNames.map((tabName) => (
        <Tabs.Tab label={tabName}>
          <Editor
            theme='vs'
            height='100%'
            language='c'
            value='// Enter your code here'
          />
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

CodeEditor.defaultProps = { className: '' };

export default CodeEditor;
