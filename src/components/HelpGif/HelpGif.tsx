import React from 'react';
import { Image } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import understandingTheProblemGif from '../../assets/understanding-the-problem.gif';
import designingASolutionGif from '../../assets/designing-a-solution.gif';
import evaluatingASolutionGif from '../../assets/evaluating-a-solution.gif';
import implementingASolutionGif from '../../assets/implementing-a-solution.gif';
import evaluatingImplementedSolutionGif from '../../assets/evaluating-implemented-solution.gif';

const HelpGif = () => {
  const location = useLocation();

  switch (location.pathname) {
    case '/assignment/problem':
      return (
        <Image src={understandingTheProblemGif} width={600} withPlaceholder />
      );
    case '/assignment/design':
      return <Image src={designingASolutionGif} width={600} withPlaceholder />;
    case '/assignment/evaluation':
      return <Image src={evaluatingASolutionGif} width={600} withPlaceholder />;
    case '/assignment/implementation':
      return (
        <Image src={implementingASolutionGif} width={600} withPlaceholder />
      );
    case '/assignment/test-cases':
      return (
        <Image
          src={evaluatingImplementedSolutionGif}
          width={600}
          withPlaceholder
        />
      );
    default:
      return null;
  }
};

export default HelpGif;
