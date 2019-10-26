import 'regenerator-runtime';
import * as React from 'react';
import styles from './style.scss';
import axios from 'axios';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';
import classNames from 'classnames';
import { withDocument, FormBuilderInput } from 'part:@sanity/form-builder';
import PatchEvent, { setIfMissing } from '@sanity/form-builder/lib/PatchEvent';
import { IType } from '../types/IType';
import { IYoastPaperOptions } from '../types/IYoastPaperOptions';
import { IField } from '../types/IField';
import { Result } from './Result';
import { langCultureMap } from './langCultureMap';

enum Tabs {
    SEO  = 'seo',
    READABILITY = 'readability',
}

interface IOptions {
    baseUrl: string;
    slug: (doc: any) => string;
    content?: (doc: any) => string;
    title?: (doc: any) => string;
    description?: (doc: any) => string;
    locale?: (doc: any) => string;
    contentSelector?: string;
}

interface IProps {
    type: IType<IOptions>;
    value: {
        focus_keyword?: string;
        focus_synonyms?: string[];
    };
    document: any;
    onChange: (...args: any[]) => void;
    onBlur: (...args: any[]) => void;
    onFocus: (...args: any[]) => void;
}

interface IState {
    openTab: Tabs;
    initialAudit: boolean;
    auditOngoing: boolean;
    keyphraseLength: number;
    metaDescriptionKeyword: number;
    linkStatistics: false | {
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
    keywordInFirstParagraph: boolean;
    keywordDensity: number;
    wordCountInText: number;
    keywordCount: false | {
        count: number;
        length: number;
        markings: any[];
        matches: string[];
    };
    keywordInPageTitle: false | {
        allWordsFound: boolean;
        exactMatchFound: boolean;
        exactMatchKeyphrase: boolean;
        position: number;
    };
    altTagCount: false | {
        noAlt: number;
        withAlt: number;
        withAltKeyword: number;
        withAltNonKeyword: number;
    };
    pageTitleWidth: number;
    keywordCountInUrl: false | {
        keyphraseLength: number;
        percentWordMatches: number;
    };
    countSentencesFromText: string[];
    sentences: string[];
    passiveVoice: false | {
        passives: string[];
        total: number;
    };
    sentenceBeginnings: false | {
        word: string;
        count: number;
        sentences: string[];
    }[];
    fleschReading: number;
    paragraphLength: false | {
        wordCount: number;
        text: string;
    }[];
    transitionWords: false | {
        sentenceResults: {
            sentence: string;
            transitionWords: string[];
        }[];
        totalSentences: number;
        transitionWordSentences: number;
    };
}

class InputContainer extends React.PureComponent<IProps, IState> {
    public state: IState = {
        openTab: Tabs.SEO,
        initialAudit: true,
        auditOngoing: true,
        keyphraseLength: 0,
        metaDescriptionKeyword: 0,
        linkStatistics: false,
        keywordInFirstParagraph: false,
        keywordDensity: 0,
        wordCountInText: 0,
        keywordCount: false,
        keywordInPageTitle: false,
        altTagCount: false,
        pageTitleWidth: 0,
        keywordCountInUrl: false,
        countSentencesFromText: [],
        passiveVoice: false,
        sentenceBeginnings: false,
        sentences: [],
        fleschReading: 0,
        paragraphLength: false,
        transitionWords: false,
    }

    private YoastSEO = require('yoastseo');

    private get value() {
        const { value } = this.props;
        if (!value) return {};
        return value;
    }

    private get idealKeywordDensity() {
        const { wordCountInText } = this.state;
        return Math.floor(wordCountInText / 180);
    }

    private get passiveVoicePercentage() {
        const { countSentencesFromText, passiveVoice } = this.state;
        if (passiveVoice && countSentencesFromText.length > 0) {
            return Math.round((passiveVoice.passives.length / countSentencesFromText.length) * 100);
        }
        return 0;
    }

    private get consecutiveSentencesCount() {
        const { sentenceBeginnings } = this.state;
        if (sentenceBeginnings) {
            return sentenceBeginnings.filter(b => b.count >= 3).length;
        }
        return 0;
    }

    private get longSentencePercentage() {
        const { sentences } = this.state;
        if (sentences) {
            const longSentences = sentences.filter(s => s.replace(/[,.;]/g, '').split(' ').filter(s => s.trim().length > 0).length > 20);
            return Math.round((longSentences.length / sentences.length) * 100);
        }
        return 0;
    }

    private get longParagraphsCount() {
        const { paragraphLength } = this.state;
        if (paragraphLength) {
            return paragraphLength.filter(p => p.wordCount > 150).length;
        }
        return 0;
    }

    private get veryLongParagraphsCount() {
        const { paragraphLength } = this.state;
        if (paragraphLength) {
            return paragraphLength.filter(p => p.wordCount > 300).length;
        }
        return 0;
    }

    private get transitionWordsSentencePercentage() {
        const { transitionWords } = this.state;
        if (transitionWords) {
            return Math.round(transitionWords.transitionWordSentences / transitionWords.totalSentences * 100);
        }
        return 0;
    }

    private get altTagCountPercentage() {
        const { altTagCount } = this.state;
        if (altTagCount) {
            return (altTagCount.withAltKeyword / (altTagCount.noAlt + altTagCount.withAlt));
        }
        return 0;
    }

    private performYoastCheck = debounce(() => {
        this.setState({
            auditOngoing: true,
        });
        return new Promise((res, rej) => {
            const { type, document } = this.props;
            const { options } = type;
            const baseUrl = options.baseUrl.replace(/\/+$/, '');
            const slug = options.slug(document);
            const url = baseUrl + '/' + slug;
            axios.get(url).then(response => {
                const content = response.data;
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                Array.from(doc.body.querySelectorAll('script')).forEach(s => s.remove());
                let langCulture = options.locale ? options.locale(document) : (doc.documentElement.lang || 'en');
                if (!langCulture.includes('-')) langCulture = langCultureMap[langCulture] || 'en-US';
                const title = options.title ? options.title(document) : doc.title;
                const description  = options.description ? options.description(document) : (doc.querySelector('meta[name="description"]') as HTMLMetaElement).content;
                const paperOptions: IYoastPaperOptions = {
                    keyword: this.value.focus_keyword || '',
                    url: slug,
                    permalink: url,
                    title,
                    synonyms: (this.value.focus_synonyms || []).join(','),
                    description,
                    locale: langCulture.replace('-', '_'),
                };
                const contentBySelector = (options.contentSelector ? doc.querySelector(options.contentSelector) : doc.body);
                const rawContent = options.content ? options.content(document) : (contentBySelector || doc.body).innerHTML;
                const paper = new this.YoastSEO.Paper(rawContent, paperOptions);
                const researcher = new this.YoastSEO.Researcher(paper);
                this.setState({
                    initialAudit: false,
                    auditOngoing: false,
                    keyphraseLength: researcher.getResearch('keyphraseLength'),
                    metaDescriptionKeyword: researcher.getResearch('metaDescriptionKeyword'),
                    linkStatistics: researcher.getResearch('getLinkStatistics'),
                    keywordInFirstParagraph: researcher.getResearch('findKeywordInFirstParagraph'),
                    keywordDensity: researcher.getResearch('getKeywordDensity'),
                    wordCountInText: researcher.getResearch('wordCountInText'),
                    keywordCount: researcher.getResearch('keywordCount'),
                    keywordInPageTitle: researcher.getResearch('findKeywordInPageTitle'),
                    altTagCount: researcher.getResearch('altTagCount'),
                    pageTitleWidth: researcher.getResearch('pageTitleWidth'),
                    keywordCountInUrl: researcher.getResearch('keywordCountInUrl'),
                    countSentencesFromText: researcher.getResearch('countSentencesFromText'),
                    passiveVoice: researcher.getResearch('passiveVoice'),
                    sentenceBeginnings: researcher.getResearch('getSentenceBeginnings'),
                    sentences: researcher.getResearch('sentences'),
                    fleschReading: researcher.getResearch('calculateFleschReading'),
                    paragraphLength: researcher.getResearch('getParagraphLength'),
                    transitionWords: researcher.getResearch('findTransitionWords'),
                });
            });
        });
    }, 2000);

    private toggleTab = (tab: Tabs) => {
        this.setState({
            openTab: tab,
        });
    }

    private handleFieldChange = (field: IField, fieldPatchEvent: PatchEvent) => {
        const { type, onChange } = this.props
        onChange(fieldPatchEvent.prefixAll(field.name).prepend(setIfMissing({_type: type.name})))
    }

    public componentDidMount() {
        this.performYoastCheck();
    }

    public componentDidUpdate(prevProps: IProps, prevState: IState) {
        const { value, document } = this.props;
        if (!isEqual(prevProps.document, document) || !isEqual(prevProps.value, value)) {
            this.performYoastCheck();
        }
    }

    public focus() {

    }

    public render() {
        const { type, value, onBlur, onFocus } = this.props;
        const { fields } = type;
        const {
            openTab,
            initialAudit,
            auditOngoing,
            keyphraseLength,
            metaDescriptionKeyword,
            linkStatistics,
            keywordInFirstParagraph,
            keywordDensity,
            keywordCount,
            wordCountInText,
            keywordInPageTitle,
            altTagCount,
            pageTitleWidth,
            keywordCountInUrl,
            fleschReading,
        } = this.state;

        return (
            <div className={styles.seotools}>
                <p className={styles.title}>SEO tools</p>
                <div className={styles.audit}>
                    {initialAudit ? (
                        <p className={styles.loading}>Performing seo audit...</p>
                    ) : (
                        <>
                            {auditOngoing && (
                                <p className={classNames(styles.loading, styles.overlay)}>Performing seo audit...</p>
                            )}
                            <div className={styles.tabs}>
                                <div className={styles.switcher}>
                                    <button disabled={openTab === Tabs.SEO} className={styles.switch} onClick={() => this.toggleTab(Tabs.SEO)}>SEO</button>
                                    <button disabled={openTab === Tabs.READABILITY} className={styles.switch} onClick={() => this.toggleTab(Tabs.READABILITY)}>Readability</button>
                                </div>

                                {openTab === Tabs.SEO && (
                                    <div className={styles.tab}>
                                        <Result valid={keyphraseLength > 0}>Keyphrase length</Result>
                                        <Result valid={keyphraseLength > 0 && metaDescriptionKeyword > 0}>Keyphrase found in meta description</Result>
                                        <Result valid={keyphraseLength > 0 && keywordInPageTitle && keywordInPageTitle.allWordsFound}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>Keyphrase found in page title</>
                                                    : <>Not all the words from your keyphrase "{this.value.focus_keyword}" appear in the SEO title</>
                                            )}
                                        </Result>
                                        <Result valid={keyphraseLength > 0 && keywordInFirstParagraph}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>Keyphrase was found in your content introduction</>
                                                    : <>Your keyphrase or its synonyms do not appear in the first paragraph.</>
                                            )}
                                        </Result>
                                        <Result valid={keyphraseLength > 0 && keywordCount && keywordCount.count >= this.idealKeywordDensity}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>Good keyphrase density in your content</>
                                                    : <>The focus keyphrase was found {keywordCount ? keywordCount.count : 0} times. That's less than the recommended minimum of {this.idealKeywordDensity} times for a text of this length.</>
                                            )}
                                        </Result>
                                        <Result valid={linkStatistics && linkStatistics.internalTotal > 0}>
                                            Internal links
                                        </Result>
                                        <Result valid={linkStatistics && linkStatistics.externalTotal > 0}>
                                            Outbound links
                                        </Result>
                                        {altTagCount && (altTagCount.noAlt + altTagCount.withAlt > 4) && (
                                            <Result valid={this.altTagCountPercentage >= .3 && this.altTagCountPercentage <= .7}>
                                                {(valid: boolean) => (
                                                    valid
                                                    ? <>Good use of topic in image alt attributes</>
                                                    : (
                                                        this.altTagCountPercentage <= .3
                                                            ? <>Too little images on this page have an alt attribute that reflect the topic of your text. ({this.altTagCountPercentage * 100}%)</>
                                                            : <>Too many images on this page have alt attribute that reflect the topic of your text. ({this.altTagCountPercentage * 100}%)</>
                                                    )
                                                )}
                                            </Result>
                                        )}
                                        {pageTitleWidth === 0 && (
                                            <Result valid={false}>
                                                Be sure to include an SEO title on your page
                                            </Result>
                                        )}
                                        {pageTitleWidth > 600 && (
                                            <Result valid={false}>
                                                Your SEO title should not be longer than 600px for optimal visibility in search engines.
                                            </Result>
                                        )}
                                        {keywordCountInUrl && keywordCountInUrl.percentWordMatches < 100 && (
                                            <Result warning>
                                                (Part of) your keyphrase does not appear in the slug.
                                            </Result>
                                        )}
                                    </div>
                                )}

                                {openTab === Tabs.READABILITY && (
                                    <div className={styles.tab}>
                                        <Result valid={this.passiveVoicePercentage <= 10} warning={this.passiveVoicePercentage > 10 && this.passiveVoicePercentage < 15}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>No excessive use of passive voice detected</>
                                                    : <>{this.passiveVoicePercentage}% of the sentences contain passive voice, which is more than the recommended maximum of 10%</>
                                            )}
                                        </Result>
                                        <Result valid={this.consecutiveSentencesCount === 0}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>No problematic consecutive sentences found</>
                                                    : <>The text contains {this.consecutiveSentencesCount} instances where 3 or more consecutive sentences start with the same word. </>
                                            )}
                                        </Result>
                                        <Result valid={this.longSentencePercentage <= 25}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>No problems with sentence length detected</>
                                                    : <>{this.longSentencePercentage}% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%</>
                                            )}
                                        </Result>
                                        <Result valid={this.longParagraphsCount === 0}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>None of the paragraphs are too long. Great job!</>
                                                    : <>{this.longParagraphsCount} of the paragraphs contain more than the recommended maximum of 150 words.</>
                                            )}
                                        </Result>
                                        <Result valid={this.veryLongParagraphsCount === 0}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>Good subheading distribution</>
                                                    : <>{this.veryLongParagraphsCount} section of your text is longer than 300 words and is not separated by any subheadings.</>
                                            )}
                                        </Result>
                                        <Result valid={this.transitionWordsSentencePercentage >= 30}>
                                            {(valid: boolean) => (
                                                valid
                                                    ? <>Good use of transition words</>
                                                    : <>Only {this.transitionWordsSentencePercentage}% of your sentences use transition words, this is less than the advised 30%</>
                                            )}
                                        </Result>
                                        {fleschReading < 60 && (
                                            <Result warning>
                                                The copy scores {fleschReading} in the flesch reading test, which is considered fairly difficult to read.
                                            </Result>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {fields.map(field => (
                    <div key={field.name} className={styles.field}>
                        <FormBuilderInput
                            key={field.name}
                            type={field.type}
                            level={type.level + 1}
                            value={value && value[field.name]}
                            onChange={patchEvent => this.handleFieldChange(field, patchEvent)}
                            onBlur={onBlur}
                            onFocus={onFocus}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

const Input = withDocument(InputContainer);
export default Input;