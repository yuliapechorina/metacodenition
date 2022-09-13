import { Stack, Tabs } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { HiOutlinePlay } from 'react-icons/hi';
import { IoRocketOutline } from 'react-icons/io5';
import useInterventions from '../../hooks/useInterventions';
import ActionPlan from '../ActionPlan';
import CodeRunArea from '../CodeRunArea';

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
    <Stack className='p-4 pt-0 relative'>
      <Tabs active={currentTabIndex} onTabChange={setCurrentTabIndex}>
        {actionPlanTabEnabled && (
          <Tabs.Tab
            label='Action Plan'
            key={0}
            icon={<IoRocketOutline size={20} />}
          >
            <ActionPlan />
          </Tabs.Tab>
        )}
        <Tabs.Tab label='Run Code' key={1} icon={<HiOutlinePlay size={20} />}>
          <CodeRunArea />
        </Tabs.Tab>
      </Tabs>
    </Stack>
  );
};

export default BottomPanel;
