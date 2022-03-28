import React from 'react';
import { Card, Flex, Text } from '@sanity/ui';

type Props = {
  valid?: boolean;
  warning?: boolean;
  children?: React.ReactNode | ((valid: boolean) => React.ReactNode);
}

export const InsightResult = ({ valid, warning, children }: Props) => {
  return (
    <Card border padding={[3]} tone={!valid ? 'critical' : (warning ? 'caution' : undefined)}>
      <Flex justify="flex-start" align="center">
        <Text>{typeof children === 'function' ? children(!!valid) : children}</Text>
      </Flex>
    </Card>
  )
}