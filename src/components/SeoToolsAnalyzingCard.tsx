import React from 'react'
import styled from 'styled-components'
import { Card, Grid, Spinner, Text } from '@sanity/ui'

const StyledGrid = styled(Grid)`
  gap: 1rem;
  grid-template-columns: auto 1fr;
`

export const SeoToolsAnalyzingCard: React.FC = () => {
  return (
    <Card padding={[3, 3, 4]} shadow={1} tone="caution">
      <StyledGrid>
        <Spinner />
        <Text>
          Updating SEO analysis...
        </Text>
      </StyledGrid>
    </Card>
  )
}
