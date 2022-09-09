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

  const textRef = React.useRef<HTMLDivElement>(null);

  const stickyTooltip = (e: React.MouseEvent) => {
    const relativeParent = relativeParentId
      ? document.getElementById(relativeParentId)?.parentElement
      : undefined;
    const boundingRect = relativeParent
      ? relativeParent?.getBoundingClientRect()
      : textRef.current?.getBoundingClientRect();
    const parentTop = boundingRect?.top ?? 0;
    const parentLeft = boundingRect?.left ?? 0;
    tooltip.forEach((t) => {
      // Calculate the left offset based on whether the tooltip is inside a relative parent
      const maxWidth =
        e.clientX - parentLeft + t.offsetWidth / 2 - (boundingRect?.width ?? 0);
      const minWidth = e.clientX - parentLeft - t.offsetWidth / 2;
      const leftOffset = maxWidth > 0 ? maxWidth : 0;
      const rightOffset = minWidth < 0 ? minWidth : 0;
      const xOffset =
        t.offsetWidth / 2 +
        leftOffset +
        rightOffset +
        (relativeParent ? parentLeft : 0);
      const yOffset = (tooltipOffset ?? 50) + (relativeParent ? parentTop : 0);

      // eslint-disable-next-line no-param-reassign
      t.style.top = `${e.clientY - yOffset}px`;
      // eslint-disable-next-line no-param-reassign
      t.style.left = `${e.clientX - xOffset}px`;
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
      ref={textRef}
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
