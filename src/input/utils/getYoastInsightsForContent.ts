type TOptions = {
    keyword: string;
    url: string;
    permalink: string;
    title: string;
    synonyms: string[];
    description: string;
    langCulture: string;
};

export const getYoastInsightsForContent = (YoastSEO: typeof import('yoastseo'), html: string, options: TOptions) => {
    const paper = new YoastSEO.Paper(html, {
        keyword: options.keyword,
        url: options.url,
        permalink: options.permalink,
        title: options.permalink,
        synonyms: options.synonyms.join(','),
        description: options.description,
        locale: options.langCulture.replace('-', '_'),
    });
    const researcher = new YoastSEO.Researcher(paper);
    return {
        keyphraseLength: researcher.getResearch('keyphraseLength'),
        metaDescriptionKeyword: researcher.getResearch('metaDescriptionKeyword'),
        linkStatistics: researcher.getResearch('linkStatistics'),
        keywordInFirstParagraph: researcher.getResearch('findKeywordInFirstParagraph'),
        keywordDensity: researcher.getResearch('getKeywordDensity'),
        wordCountInText: researcher.getResearch('wordCountInText'),
        keywordCount:  researcher.getResearch('keywordCount'),
        keywordInPageTitle:  researcher.getResearch('findKeywordInPageTitle'),
        altTagCount: researcher.getResearch('altTagCount'),
        pageTitleLength: researcher.getResearch('pageTitleLength'),
        keywordCountInUrl: researcher.getResearch('keywordCountInUrl'),
        countSentencesFromText: researcher.getResearch('countSentencesFromText'),
        passiveVoice: researcher.getResearch('passiveVoice'),
        sentenceBeginnings: researcher.getResearch('getSentenceBeginnings'),
        sentences: researcher.getResearch('sentences'),
        fleschReading: researcher.getResearch('calculateFleschReading'),
        paragraphLength: researcher.getResearch('getParagraphLength'),
        transitionWords: researcher.getResearch('findTransitionWords'),
    };
}