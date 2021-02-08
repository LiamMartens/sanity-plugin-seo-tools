declare module 'part:@sanity/*';
declare module '*.scss' {
    const c: { [key: string]: string; };
    export = c;
}
declare module 'config:seo-tools' {
    const config: {
        focus_keyword_required?: boolean;
        focus_synonyms_required?: boolean;
        seo_title_requied?: boolean;
        meta_description_required?: boolean;
    };
    export default config;
  }