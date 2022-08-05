import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Box } from '@sanity/ui'
import type { AssessmentRating } from 'yoastseo'

type Props = {
  rating: AssessmentRating
}

const StyledBubbleBox = styled(Box)`
  border-radius: 9999px;
  margin-top: .4rem;
  width: .8rem;
  height: .8rem;
`

export const SeoRatingBubble: React.FC<Props> = ({ rating }) => {
  const color = useMemo(() => {
    switch (rating) {
      case 'good': return '#7ad03a'
      case 'ok': return '#ee7c1b'
      case 'bad': return '#dc3232'
      default: return '#888'
    }
  }, [rating]);

  return (
    <StyledBubbleBox
      style={{ backgroundColor: color }}
    />
  )
}