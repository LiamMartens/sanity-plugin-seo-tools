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

export const SEOInputReadabilityTab: React.FunctionComponent<Props> = ({ hidden, insights, value }) => {
  const passiveVoicePercentage = React.useMemo(() => {
    if (insights?.passiveVoice && insights.countSentencesFromText.length) return Math.round((insights.passiveVoice.passives.length / insights.countSentencesFromText.length) * 100);
    return 0;
  }, [insights]);
  const consecutiveSentencesCount = React.useMemo(() => {
    if (insights?.sentenceBeginnings) return insights.sentenceBeginnings.filter(b => b.count >= 3).length;
    return 0;
  }, [insights]);
  const longSentencePercentage = React.useMemo(() => {
    if (insights?.sentences.length) {
      const longSentences = insights.sentences.filter(s => s.replace(/[,.;]/g, '').split(' ').filter(s => s.trim().length > 0).length > 20);
      return Math.round((longSentences.length / insights.sentences.length) * 100);
    }
    return 0;
  }, [insights]);
  const longParagraphsCount = React.useMemo(() => {
    if (insights?.paragraphLength) return insights.paragraphLength.filter(p => p.wordCount > 150).length;
    return 0;
  }, [insights]);
  const veryLongParagraphsCount = React.useMemo(() => {
    if (insights?.paragraphLength) return insights.paragraphLength.filter(p => p.wordCount > 300).length;
    return 0;
  }, [insights]);
  const transitionWordsSentencePercentage = React.useMemo(() => {
    if (insights?.transitionWords && insights.transitionWords.totalSentences) {
      return Math.round(insights.transitionWords.transitionWordSentences / insights.transitionWords.totalSentences * 100);
    }
    return 0;
  }, [insights]);

  return (
    <TabPanel
      hidden={hidden}
      id={Tabs.READABILITY}
      aria-labelledby={Tabs.READABILITY}
    >
      {(!!insights) && (
        <Stack space={2} marginTop={2}>
          <InsightResult valid={passiveVoicePercentage <= 10} warning={passiveVoicePercentage > 10 && passiveVoicePercentage < 15}>
            {valid => valid
              ? <>No excessive use of passive voice detected</>
              : <>{passiveVoicePercentage}% of the sentences contain passive voice, which is more than the recommended maximum of 10%</>}
          </InsightResult>
          <InsightResult valid={consecutiveSentencesCount === 0}>
            {valid => valid
              ? <>No problematic consecutive sentences found</>
              : <>The text contains {consecutiveSentencesCount} instances where 3 or more consecutive sentences start with the same word. </>}
          </InsightResult>
          <InsightResult valid={longSentencePercentage === 0}>
            {valid => valid
              ? <>No problems with sentence length detected</>
              : <>{longSentencePercentage}% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%</>}
          </InsightResult>
          <InsightResult valid={longParagraphsCount === 0}>
            {valid => valid
              ? <>None of the paragraphs are too long. Great job!</>
              : <>{longParagraphsCount} of the paragraphs contain more than the recommended maximum of 150 words.</>}
          </InsightResult>
          <InsightResult valid={veryLongParagraphsCount === 0}>
            {valid => valid
              ? <>Good subheading distribution</>
              : <>{veryLongParagraphsCount} section of your text is longer than 300 words and is not separated by any subheadings.</>}
          </InsightResult>
          <InsightResult valid={transitionWordsSentencePercentage >= 30}>
            {valid => valid
              ? <>Good use of transition words</>
              : <>Only {transitionWordsSentencePercentage}% of your sentences use transition words, this is less than the advised 30%</>}
          </InsightResult>
          {(insights.fleschReading < 60) && (
            <InsightResult warning>
              The copy scores {insights.fleschReading} in the flesch reading test, which is considered fairly difficult to read.
            </InsightResult>
          )}
        </Stack>
      )}
    </TabPanel>
  )
}