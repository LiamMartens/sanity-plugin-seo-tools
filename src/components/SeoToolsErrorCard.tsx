import React, { PropsWithChildren } from 'react'
import { Card, Text } from '@sanity/ui'

type Props = PropsWithChildren<{}>

export const SeoToolsErrorCard: React.FC<Props> = ({ children }) => {
  return (
    <Card padding={[3, 3, 4]} shadow={1} tone="critical">
      <Text>
        {children}
      </Text>
    </Card>
  )
}
