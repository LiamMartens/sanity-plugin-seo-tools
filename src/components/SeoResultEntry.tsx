import { Box, Grid } from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import type { AssessmentRating, AssessmentResult } from 'yoastseo'
import { SeoRatingBubble } from './SeoRatingBubble'

type Props = {
  result: AssessmentResult & {
    rating: AssessmentRating
  }
}

const StyledGrid = styled(Grid)`
  align-items: flex-start;
  gap: .5rem;
  grid-template-columns: auto 1fr;
`

export const SeoResultEntry: React.FC<Props> = ({ result }) => {
  return (
    <StyledGrid>
      <Box>
        <SeoRatingBubble rating={result.rating} />
      </Box>
      <Box dangerouslySetInnerHTML={{ __html: result.text }} />
    </StyledGrid>
  )
}