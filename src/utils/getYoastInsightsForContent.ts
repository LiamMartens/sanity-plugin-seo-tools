import Jed from 'jed'
import get from 'just-safe-get'
import pixelWidth from 'string-pixel-width';
import { AssessmentRating, AssessmentResult } from 'yoastseo';
import yoastseoDefaultConfig from 'yoastseo/src/config/content/default.js'
import { AssessmentCategory } from '../constants';

type Options = {
  keyword: string;
  url: string;
  permalink: string;
  title: string;
  synonyms: string[];
  description: string;
  langCulture: string;
};

const IgnoredAssessments = [
  'UrlLengthAssessment',
  'TaxonomyTextLengthAssessment'
]

const AssessmentClassConfigKeyMap = {
  FleschReadingEaseAssessment: 'fleschReading',
  SentenceLengthInTextAssessment: 'sentenceLength',
}

export const getYoastInsightsForContent = (
  YoastSEO: typeof import("yoastseo"),
  html: string,
  options: Options
) => {
  const paper = new YoastSEO.Paper(html, {
    keyword: options.keyword,
    url: options.url,
    permalink: options.permalink,
    title: options.title,
    ...(options.title && {
      titleWidth: pixelWidth(options.title, { font: "arial", size: 20 }),
    }),
    synonyms: options.synonyms.join(","),
    description: options.description,
    locale: options.langCulture.replace("-", "_"),
  })
  const researcher = new YoastSEO.Researcher(paper)
  const i18n = new Jed({
    domain: 'js-text-analysis',
    locale_data: { 'js-text-analysis': { '': {} } },
  })

  console.debug('YoastSEO.assessments', YoastSEO.assessments)
  return Object.entries(YoastSEO.assessments).reduce<Record<AssessmentCategory, (AssessmentResult & {
    rating: AssessmentRating
  })[]>>((acc, [category, assessments]) => {
    Object.entries(assessments).forEach(([name, value]) => {
      if (!IgnoredAssessments.includes(name)) {
        if (
          typeof value === 'object'
          && value?.hasOwnProperty('getResult')
        ) {
          const result = value.getResult(paper, researcher, i18n)
          if (result?.text) {
            acc[category as AssessmentCategory].push({
              ...result,
              rating: YoastSEO.helpers.scoreToRating(result.score),
            })
          }
        } else if (typeof value === 'function') {
          const configKey = get(AssessmentClassConfigKeyMap, name, null) as string | null | undefined
          const config = configKey ? get(yoastseoDefaultConfig, configKey, {}) : {}
          const result = new value(config).getResult(paper, researcher, i18n)
          if (result?.text) {
            acc[category as AssessmentCategory].push({
              ...result,
              rating: YoastSEO.helpers.scoreToRating(result.score),
            })
          }
        }
      }
    });
    if (Object.prototype.hasOwnProperty.call(acc, category)) {
      acc[category as AssessmentCategory].sort((a, b) => {
        if (a.rating === 'feedback') return -1
        if (b.rating === 'feedback') return 1
        return a.score < b.score ? -1 : 1
      })
    }
    return acc
  }, {
    [AssessmentCategory.SEO]: [],
    [AssessmentCategory.READABILITY]: [],
  });
};
