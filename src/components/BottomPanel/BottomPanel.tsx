import { Stack, Tabs } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { HiOutlinePlay, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { IoRocketOutline } from 'react-icons/io5';
import useInterventions from '../../hooks/useInterventions';
import ActionPlan from '../ActionPlan';
import CodeRunArea from '../CodeRunArea';
import ProblemText from '../ProblemText';

const BottomPanel = () => {
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const { interventions } = useInterventions();
  const [actionPlanTabEnabled, setActionPlanTabEnabled] = useState(true);

  useEffect(() => {
    const evaluatingASolutionEnabled = interventions.find(
      ({ name }) => name === 'Evaluating a solution'
    )?.enabled;
    setActionPlanTabEnabled(evaluatingASolutionEnabled ?? false);
  }, [interventions]);

  return (
    <Stack className='p-4 pt-0 relative h-full'>
      <Tabs
        active={currentTabIndex}
        onTabChange={setCurrentTabIndex}
        classNames={{ body: 'overflow-y-auto h-full pb-8', root: 'h-full' }}
      >
        {actionPlanTabEnabled && (
          <Tabs.Tab
            label='Action Plan'
            key={0}
            icon={<IoRocketOutline size={20} />}
          >
            <ActionPlan />
          </Tabs.Tab>
        )}
        <Tabs.Tab
          label='Problem'
          key={1}
          icon={<HiOutlineQuestionMarkCircle size={20} />}
        >
          <ProblemText />
        </Tabs.Tab>
        <Tabs.Tab label='Run Code' key={2} icon={<HiOutlinePlay size={20} />}>
          <CodeRunArea />
        </Tabs.Tab>
      </Tabs>
    </Stack>
  );
};

export default BottomPanel;
