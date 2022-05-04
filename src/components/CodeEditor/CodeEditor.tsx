import { Tabs } from '@mantine/core';
import Editor from '@monaco-editor/react';
import React, { useState } from 'react';

const CodeEditor = () => {
  const tabNames = ['main.c', 'main.h'];
  const [activeTab, setActiveTab] = useState(1);

  return (
    <Tabs
      active={activeTab}
      onTabChange={setActiveTab}
      variant='outline'
      classNames={{ body: 'h-full', root: 'h-full' }}
    >
      {tabNames.map((tabName) => (
        <Tabs.Tab label={tabName}>
          <Editor theme='vs' language='c' value='// Enter your code here' />
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

export default CodeEditor;
