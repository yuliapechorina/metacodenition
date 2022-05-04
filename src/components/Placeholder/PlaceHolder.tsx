import React from 'react';
import { Text } from '@mantine/core';

type PlaceHolderProps = {
  elementName: String;
};
const PlaceHolder = ({ elementName }: PlaceHolderProps) => (
  <Text>Placeholder for {elementName}</Text>
);

export default PlaceHolder;
