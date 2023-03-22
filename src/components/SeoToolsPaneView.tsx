import React, { useCallback, useContext, useState } from 'react'
import useSWR from 'swr'
import YoastSEO from 'yoastseo'
import SerpPreview from 'react-serp-preview'
import { SeoToolsContext } from '../context'
import { InvalidConfigurationError } from '../errors'
import { extractErrorMessage, getYoastInsightsForContent, prepareRemoteData } from '../utils'
import { Box, Card, Grid, Spinner, Stack, Tab, TabList, TabPanel, Text } from '@sanity/ui'
import type { SanityDocument } from '@sanity/types'
import { SeoToolsAnalyzingCard } from './SeoToolsAnalyzingCard'
import { SeoToolsErrorCard } from './SeoToolsErrorCard'
import { AssessmentCategory } from '../constants'
import { SeoResultEntry } from './SeoResultEntry'

type Props = {
  document: SanityDocument
}

export const SeoToolsPaneView: React.FC<Props> = ({ document }) => {
  const config = useContext(SeoToolsContext)
  const [currentTab, setCurrentTab] = useState(AssessmentCategory.SEO)

  const seoData = useSWR(['seoData', document._id, document._rev, config], async ([key, id, rev, config]) => {
    const [seoFields, productionUrl] = await Promise.all([
      config.select(document),
      config.resolveProductionUrl(document),
    ]);

    if (!config.fetch && !config.prepare) {
      throw new InvalidConfigurationError(
        'When disabling the "fetch" behavior, you need to provide the prepare configuration'
      )
    }

    const preparedData = config.fetch
      ? await prepareRemoteData(productionUrl, {
        contentSelector: config.contentSelector,
      })
      : await config.prepare!(document)

    const yoastInsights = getYoastInsightsForContent(YoastSEO, preparedData.content, {
      url: productionUrl.toString(),
      permalink: productionUrl.toString(),
      title: preparedData.title,
      description: preparedData.description,
      langCulture: preparedData.locale,
      keyword: seoFields.focus_keyword ?? '',
      synonyms: seoFields.focus_synonyms ?? [],
    })

    return {
      yoastInsights,
      productionUrl,
      seo: seoFields,
      prepared: preparedData,
    }
  }, {
    revalidateOnFocus: false,
  });

  const handleSetSeoTab = useCallback(() => {
    setCurrentTab(AssessmentCategory.SEO)
  }, []);

  const handleSetReadabilityTab = useCallback(() => {
    setCurrentTab(AssessmentCategory.READABILITY)
  }, []);

  return (
    <Box padding={3}>
      {seoData.isValidating && (
        <SeoToolsAnalyzingCard />
      )}

      {seoData.error && (
        <SeoToolsErrorCard>
          {extractErrorMessage(seoData.error)}
        </SeoToolsErrorCard>
      )}

      {seoData.data && (
        <Stack space={3}>
            {config.render(seoData.data.seo, seoData.data.prepared, (
              <Card shadow={1} padding={[2, 2, 3]}>
                <SerpPreview
                  title={seoData.data.seo.seo_title ?? ''}
                  metaDescription={seoData.data.seo.meta_description ?? ''}
                  url={seoData.data.productionUrl.toString()}
                />
            </Card>
          ))}
          <TabList space={2}>
            <Tab
              id="tablist-tab-seo"
              label="SEO"
              aria-controls="tabpanel-seo"
              selected={currentTab === AssessmentCategory.SEO}
              onClick={handleSetSeoTab}
            />
            <Tab
              id="tablist-tab-readability"
              label="Readability"
              aria-controls="tabpanel-readability"
              selected={currentTab === AssessmentCategory.READABILITY}
              onClick={handleSetReadabilityTab}
            />
          </TabList>

          <TabPanel id="tabpanel-seo" aria-labelledby="tablist-tab-seo" hidden={currentTab !== AssessmentCategory.SEO}>
            <Card tone="default" shadow={1} padding={[2, 2, 3]}>
              <Stack space={3}>
                {seoData.data.yoastInsights.seo.map((result) => (
                  <SeoResultEntry key={result.text} result={result} />
                ))}
              </Stack>
            </Card>
          </TabPanel>

          <TabPanel id="tabpanel-readability" aria-labelledby="tablist-tab-readability" hidden={currentTab !== AssessmentCategory.READABILITY}>
            <Card tone="default" shadow={1} padding={[2, 2, 3]}>
              <Stack space={3}>
                {seoData.data.yoastInsights.readability.map((result) => (
                  <SeoResultEntry key={result.text} result={result} />
                ))}
              </Stack>
            </Card>
          </TabPanel>
        </Stack>
      )}
    </Box>
  )
}