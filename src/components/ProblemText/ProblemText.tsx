import { TypographyStylesProvider, Text } from '@mantine/core';
import HTMLReactParser from 'html-react-parser';
import React, { useState, useEffect } from 'react';
import useQuestion from '../../hooks/useQuestion';

const ProblemText = ({
  className,
  classNames,
  onMouseUp,
  relativeParentId,
  tooltipOffset,
}: {
  className?: string;
  classNames?: { text?: string; provider?: string };
  onMouseUp?: () => void;
  relativeParentId?: string;
  tooltipOffset?: number;
}) => {
  const { text: textClassNames, provider: providerClassNames } =
    classNames || {};
  const { getProblemStatement } = useQuestion();
  const [tooltip, setToolTip] = useState(
    document.querySelectorAll<HTMLElement>('.tooltiptext')
  );

  const stickyTooltip = (e: React.MouseEvent) => {
    const relativeParent = relativeParentId
      ? document.getElementById(relativeParentId)
      : undefined;
    tooltip.forEach((t) => {
      // eslint-disable-next-line no-param-reassign
      t.style.top = `${
        e.clientY -
        (relativeParent?.getBoundingClientRect().top ?? 0) -
        (tooltipOffset ?? 50)
      }px`;
      // eslint-disable-next-line no-param-reassign
      t.style.left = `${
        e.clientX -
        (relativeParent?.getBoundingClientRect().left ?? 0) -
        t.offsetWidth / 2
      }px`;
    });
  };

  useEffect(() => {
    setToolTip(document.querySelectorAll<HTMLElement>('.tooltiptext'));
  }, [getProblemStatement]);

  return (
    <Text
      className={`${className} ${textClassNames} text-justify`}
      onMouseUp={onMouseUp}
      onMouseMove={(e: React.MouseEvent) => stickyTooltip(e)}
    >
      <TypographyStylesProvider className={providerClassNames}>
        {HTMLReactParser(getProblemStatement!())}
      </TypographyStylesProvider>
    </Text>
  );
};

ProblemText.defaultProps = {
  className: '',
  classNames: {},
  onMouseUp: () => {},
  relativeParentId: undefined,
  tooltipOffset: 50,
};

export default ProblemText;
