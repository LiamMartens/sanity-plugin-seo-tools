import pixelWidth from "string-pixel-width";

type TOptions = {
  keyword: string;
  url: string;
  permalink: string;
  title: string;
  synonyms: string[];
  description: string;
  langCulture: string;
};

export const getYoastInsightsForContent = (
  YoastSEO: typeof import("yoastseo"),
  html: string,
  options: TOptions
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
  });
  const researcher = new YoastSEO.Researcher(paper);
  return {
    keyphraseLength: researcher.getResearch("keyphraseLength"),
    metaDescriptionKeyword: researcher.getResearch("metaDescriptionKeyword"),
    getLinkStatistics: researcher.getResearch("getLinkStatistics"),
    firstParagraph: researcher.getResearch("firstParagraph"),
    keywordDensity: researcher.getResearch("getKeywordDensity"),
    wordCountInText: researcher.getResearch("wordCountInText"),
    keywordCount: researcher.getResearch("keywordCount"),
    keywordInPageTitle: researcher.getResearch("findKeywordInPageTitle"),
    altTagCount: researcher.getResearch("altTagCount"),
    pageTitleWidth: researcher.getResearch("pageTitleWidth"),
    keywordCountInUrl: researcher.getResearch("keywordCountInUrl"),
    countSentencesFromText: researcher.getResearch("countSentencesFromText"),
    passiveVoice: researcher.getResearch("passiveVoice"),
    sentenceBeginnings: researcher.getResearch("getSentenceBeginnings"),
    sentences: researcher.getResearch("sentences"),
    fleschReading: researcher.getResearch("calculateFleschReading"),
    paragraphLength: researcher.getResearch("getParagraphLength"),
    transitionWords: researcher.getResearch("findTransitionWords"),
  };
};
