import React from 'react'
import { Box, Card, Text } from '@sanity/ui'

// @README this should never happen

export const SeoToolsPaneEmptyView: React.FC = () => {
  return (
    <Box padding={3}>
      <Card padding={[3, 3, 4]} radius={2} tone="caution" shadow={1}>
        <Text>Oops, looks like there is no document to review.</Text>
      </Card>
    </Box>
  )
}