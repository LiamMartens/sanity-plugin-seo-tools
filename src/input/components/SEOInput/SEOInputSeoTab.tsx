import React from 'react';
import { Stack, TabPanel } from '@sanity/ui';
import { Tabs } from '../../constants';
import { getYoastInsightsForContent } from '../../utils';
import { InsightResult } from '../InsightResult';

type Props = {
  hidden?: boolean;
  insights?: ReturnType<typeof getYoastInsightsForContent>;
  value?: {
    focus_keyword?: string;
    focus_synonyms?: string[];
  };
}

export const SEOInputSeoTab: React.FunctionComponent<Props> = ({ hidden, insights, value }) => {
  const idealKeywordDensity = React.useMemo(() => Math.floor((insights?.wordCountInText ?? 0) / 180), [insights]);
  const altTagCountPercentage = React.useMemo(() => {
    if (insights?.altTagCount) {
      const altTagCount = insights.altTagCount;
      return (altTagCount.withAltKeyword / (altTagCount.noAlt + altTagCount.withAlt));
    }
    return 0;
  }, [insights]);

  return (
    <TabPanel
      hidden={hidden}
      id={Tabs.SEO}
      aria-labelledby={Tabs.SEO}
    >
      {(!!insights) && (
        <Stack space={2} marginTop={2}>
          <InsightResult valid={insights.keyphraseLength > 0}>Keyphrase length</InsightResult>
          <InsightResult valid={insights.keyphraseLength > 0 && insights.metaDescriptionKeyword > 0}>Keyphrase found in meta description</InsightResult>
          <InsightResult valid={insights.keyphraseLength > 0 && insights.keywordInPageTitle && insights.keywordInPageTitle.allWordsFound}>
            {(valid) => valid ? <>Keyphrase found in page title</> : <>Not all the words from your keyphrase "{value?.focus_keyword ?? ''}" appear in the SEO title</>}
          </InsightResult>
          <InsightResult valid={insights.keyphraseLength > 0 && insights.firstParagraph && insights.firstParagraph.foundInParagraph}>
            {(valid) => valid ? <>Keyphrase was found in your content introduction</> : <>Your keyphrase or its synonyms do not appear in the first paragraph.</>}
          </InsightResult>
          <InsightResult valid={insights.keyphraseLength > 0 && insights.keywordCount && insights.keywordCount.count >= idealKeywordDensity}>
            {(valid) => valid ? <>Good keyphrase density in your content</> : <>The focus keyphrase was found {insights.keywordCount ? insights.keywordCount.count : 0} times. That's less than the recommended minimum of {idealKeywordDensity} times for a text of this length.</>}
          </InsightResult>
          <InsightResult valid={insights.getLinkStatistics && insights.getLinkStatistics.internalTotal > 0}>Internal links</InsightResult>
          <InsightResult valid={insights.getLinkStatistics && insights.getLinkStatistics.externalTotal > 0}>Outbound links</InsightResult>
          {(insights.altTagCount && (insights.altTagCount.noAlt + insights.altTagCount.withAlt > 4)) && (
            <InsightResult valid={altTagCountPercentage >= .3 && altTagCountPercentage <= .7}>
              {(valid) => valid
                ? <>Good use of topic in image alt attributes</>
                : (
                  altTagCountPercentage <= .3
                    ? <>Too little images on this page have an alt attribute that reflect the topic of your text. ({altTagCountPercentage * 100}%)</>
                    : <>Too many images on this page have alt attribute that reflect the topic of your text. ({altTagCountPercentage * 100}%)</>
                )
              }
            </InsightResult>
          )}
          {insights.pageTitleWidth === 0 && (
            <InsightResult valid={false}>Be sure to include an SEO title on your page</InsightResult>
          )}
          {insights.pageTitleWidth > 600 && (
            <InsightResult valid={false}>Your SEO title should not be longer than 600px for optimal visibility in search engines.</InsightResult>
          )}
          {(insights.keywordCountInUrl && insights.keywordCountInUrl.percentWordMatches < 100) && (
            <InsightResult warning>(Part of) your keyphrase does not appear in the slug.</InsightResult>
          )}
        </Stack>
      )}
    </TabPanel>
  )
}
