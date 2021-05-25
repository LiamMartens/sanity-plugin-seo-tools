declare module 'part:@sanity/*';
declare module '*.scss' {
    const c: { [key: string]: string; };
    export = c;
}
declare module 'part:sanity-plugin-seo-tools/schema-customizer?' {
    type TSanityField = {
        name: string;
        type: string;
        title: string;
        [key: string]: any;
    }

    type TSchema = {
        name: string;
        title: string;
        fields: TSanityField[];
        [key: string]: any;
    }

    const customizer: ((input: TSchema) => TSchema) | undefined;
    export default customizer;
}
declare module 'config:seo-tools' {
    const config: {
        focus_keyword_required?: boolean;
        focus_synonyms_required?: boolean;
        seo_title_required?: boolean;
        meta_description_required?: boolean;
    };
    export default config;
}
declare module 'yoastseo' {
    export class Paper {
        constructor(html: string, options: {
            keyword?: string;
            synonyms?: string;
            description?: string;
            title?: string;
            titleWidth?: number;
            url?: string;
            locale?: string;
            permalink?: string;
        });
    }
    export class Researcher {
        constructor(paper: Paper);
        getResearch(type: 'keyphraseLength'): number;
        getResearch(type: 'metaDescriptionKeyword'): number;
        getResearch(type: 'getLinkStatistics'): false | {
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
        getResearch(type: 'firstParagraph'): false | {
            foundInOneSentence: boolean;
            foundInParagraph: boolean;
            keyphraseOrSynonym: string;
        };
        getResearch(type: 'getKeywordDensity'): number;
        getResearch(type: 'wordCountInText'): number;
        getResearch(type: 'keywordCount'): false | {
            count: number;
            length: number;
            markings: any[];
            matches: string[];
        };
        getResearch(type: 'findKeywordInPageTitle'): false | {
            allWordsFound: boolean;
            exactMatchFound: boolean;
            exactMatchKeyphrase: boolean;
            position: number;
        };
        getResearch(type: 'altTagCount'): false | {
            noAlt: number;
            withAlt: number;
            withAltKeyword: number;
            withAltNonKeyword: number;
        };
        getResearch(type: 'pageTitleWidth'): number;
        getResearch(type: 'keywordCountInUrl'): false | {
            keyphraseLength: number;
            percentWordMatches: number;
        };
        getResearch(type: 'countSentencesFromText'): string[];
        getResearch(type: 'passiveVoice'): false | {
            passives: string[];
            total: number;
        };
        getResearch(type: 'getSentenceBeginnings'): false | {
            word: string;
            count: number;
            sentences: string[];
        }[];
        getResearch(type: 'sentences'): string[];
        getResearch(type: 'calculateFleschReading'): number;
        getResearch(type: 'getParagraphLength'): false | {
            wordCount: number;
            text: string;
        }[];
        getResearch(type: 'findTransitionWords'): false | {
            sentenceResults: {
                sentence: string;
                transitionWords: string[];
            }[];
            totalSentences: number;
            transitionWordSentences: number;
        };
    }
}
declare module 'string-pixel-width' {
    function pixelWidth(input: string,
                        settings?: {
                            font?: string,
                            size?: number,
                        }): number;
    export default pixelWidth;
};
