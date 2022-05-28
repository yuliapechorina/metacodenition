import { Tabs } from '@mantine/core';
import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import useCode from '../../context/CodeContext';

const CodeEditor = () => {
  const tabNames = ['main.c', 'main.h'];
  const [activeTab, setActiveTab] = useState(0);
  const { addCodeToFile, getCodeFromFile } = useCode();
  const [value, setValue] = useState('');

  const handleChange = (val?: string) => {
    const currentFile = tabNames[activeTab];
    addCodeToFile!(currentFile, val!);
    setValue(val!);
  };

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
    const currentFile = tabNames[tabIndex];
    const code = getCodeFromFile!(currentFile);
    setValue(code);
  };

  useEffect(() => {
    const currentFile = tabNames[activeTab];
    const code = getCodeFromFile!(currentFile);
    setValue(code);
  }, []);

  return (
    <Tabs
      active={activeTab}
      onTabChange={handleTabChange}
      variant='outline'
      classNames={{ body: 'h-full', root: 'h-full' }}
    >
      {tabNames.map((tabName) => (
        <Tabs.Tab label={tabName}>
          <Editor
            theme='vs'
            language='c'
            defaultValue='// Enter your code here'
            value={value}
            onChange={handleChange}
          />
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

export default CodeEditor;
