declare module 'part:@sanity/*';
declare module '*.module.css' {
  const c: { [key: string]: string };
  export = c;
}
declare module 'react-serp-preview' {
  const SerpPreview: import('react').FC<{
    title: string
    metaDescription: string
    url: string
  }>
  export default SerpPreview
}
declare module 'yoastseo' {
  export class Paper {
    constructor(
      html: string,
      options: {
        keyword?: string;
        synonyms?: string;
        description?: string;
        title?: string;
        titleWidth?: number;
        url?: string;
        locale?: string;
        permalink?: string;
      }
    );
  }
  export class Researcher {
    constructor(paper: Paper);
    getResearch(type: 'keyphraseLength'): number;
    getResearch(type: 'metaDescriptionKeyword'): number;
    getResearch(type: 'getLinkStatistics'):
      | false
      | {
          total: number;
          totalNaKeyword: number;
          keyword: {
            totalKeyword: number;
            matchedAnchors: any[];
          };
          internalTotal: number;
          internalDofollow: number;
          internalNofollow: number;
          externalTotal: number;
          externalDofollow: number;
          externalNofollow: number;
          otherTotal: number;
          otherDofollow: number;
          otherNofollow: number;
        };
    getResearch(type: 'firstParagraph'):
      | false
      | {
          foundInOneSentence: boolean;
          foundInParagraph: boolean;
          keyphraseOrSynonym: string;
        };
    getResearch(type: 'getKeywordDensity'): number;
    getResearch(type: 'wordCountInText'): number;
    getResearch(type: 'keywordCount'):
      | false
      | {
          count: number;
          length: number;
          markings: any[];
          matches: string[];
        };
    getResearch(type: 'findKeywordInPageTitle'):
      | false
      | {
          allWordsFound: boolean;
          exactMatchFound: boolean;
          exactMatchKeyphrase: boolean;
          position: number;
        };
    getResearch(type: 'altTagCount'):
      | false
      | {
          noAlt: number;
          withAlt: number;
          withAltKeyword: number;
          withAltNonKeyword: number;
        };
    getResearch(type: 'pageTitleWidth'): number;
    getResearch(type: 'keywordCountInUrl'):
      | false
      | {
          keyphraseLength: number;
          percentWordMatches: number;
        };
    getResearch(type: 'countSentencesFromText'): string[];
    getResearch(type: 'passiveVoice'):
      | false
      | {
          passives: string[];
          total: number;
        };
    getResearch(type: 'getSentenceBeginnings'):
      | false
      | {
          word: string;
          count: number;
          sentences: string[];
        }[];
    getResearch(type: 'sentences'): string[];
    getResearch(type: 'calculateFleschReading'): number;
    getResearch(type: 'getParagraphLength'):
      | false
      | {
          wordCount: number;
          text: string;
        }[];
    getResearch(type: 'findTransitionWords'):
      | false
      | {
          sentenceResults: {
            sentence: string;
            transitionWords: string[];
          }[];
          totalSentences: number;
          transitionWordSentences: number;
        };
  }

  export type AssessmentResult = {
    score: number
    text :string
  }

  export type AssessmentCategory = import('./src/constants/AssessmentCategory').AssessmentCategory
  export type AssessmentRating = 'error' | 'feedback' | 'bad' | 'ok' | 'good' | ''
  export class Assessment {
    constructor(...args: any[])
    getResult(paper: Paper, researcher: Researcher, i18n: import('jed')): AssessmentResult | null
  }

  export const assessments: Record<
    AssessmentCategory,
    Record<string, Assessment | typeof Assessment>
  >

  export const helpers: {
    scoreToRating(score: number): AssessmentRating
  }
}

declare module 'yoastseo/src/config/content/default.js' {
  const config: Record<string, any>
  export default config
}

declare module 'string-pixel-width' {
  function pixelWidth(
    input: string,
    settings?: {
      font?: string;
      size?: number;
    }
  ): number;
  export default pixelWidth;
}
declare module 'jed' {
  export default class Jed {
    constructor(opts: {
      domain: string
      locale_data: Record<string, (
        Record<string, unknown>
      )>
    })
  }
}
