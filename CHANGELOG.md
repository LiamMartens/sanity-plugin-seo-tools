# Changelog

## v3.2.0
* Updated dependencies
* Replaced dynamic import to YoastSEO with direct import
* Fixed bug in `getYoastInsightsForContent`

## v3.1.0
* Moved `yoastseo` to peerdependencies

## v3.0.0
**BREAKING**
**In the new version of this plugin the custom input has been replaced with a custom pane and the schema is no longer pre-defined allowing you to set-up your own SEO fields.**
* Updated with pane view similar to `sanity-plugin-seo-pane` but with local rendering support and more customizable options.

## v2.2.1
* Minor fix to `NaN` results
* Removed `.scss` files and cleaned up unused files

## v2.2.0
* [#28] Added `part:sanity-plugin-seo-tools/schema-customizer` part to be able to customize the schema

## v2.1.0
* Bumped dependencies from dependabot
* Updated linkStatistics, findKeywordInFirstParagraph and pageTitleLength researchers (Author [kjmph](https://github.com/kjmph))

## v2.0.0
* Revised SEO tools UI with `@sanity/ui`

## v1.1.2
* Include `config.dist.json` in npm package so Sanity can automatically create it.

## v1.1.1
* Fixed typo to in `seo_title_required`
* Fallbackt to not using config file

## v1.1.0
* [#16](https://github.com/LiamMartens/sanity-plugin-seo-tools/issues/16) A bug was fixed where the SEO title would not be detected correctly
* [#22](https://github.com/LiamMartens/sanity-plugin-seo-tools/issues/22) Updated to CSS variables for theming
* [#17](https://github.com/LiamMartens/sanity-plugin-seo-tools/issues/17) Added config options to make SEO fields required

## v1.0.5
You can now disable fetching the remote document by setting `fetchRemote` to `false`.
**Keep in mind you need to provide the additional content methods when disabling the remote**

## v1.0.4
* [PR #4](https://github.com/LiamMartens/sanity-plugin-seo-tools/pull/4) Make patch event import use form-builder part