# SEO Tools for Sanity

## Background
When proposing backend solutions for a client website many will request something like WordPress as this is a system they are familiar with. One of the tools that is available for WordPress is Yoast to give the user feedback on the SEO of the current page. This plugin can bring those insights into Sanity for your clients so you can finally start developing those projects with Sanity. (it is powered by YoastSEO.js)  

## How to use
1. Install the plugin using the Sanity CLI `sanity install seo-tools`
2. Configure your document with the SEO tools.
*The result of the `content(doc)` function should represent the final result of (??)  but does not have to be 100% accurate. It should act as a real-time representation of the resulting content*
```
export default {
    type: 'document',
    name: '...',
    title: '...',
    fields: [{
        name: 'seo',
        title: 'SEO',
        type: 'seo-tools', // use seo-tools type
        options: {
            baseUrl: 'https://.../', // (REQUIRED) This is the baseUrl for your site
            baseUrl(doc) {
                return 'https://.../'; // for dynamic baseUrls
            },
            slug(doc) { // (REQUIRED) a function to return the slug of the current page, which will be appended to the baseUrl
                return doc.slug.current;
            },
            fetchRemote: true, // Can be set to false to disable fetching the remote source (you will need to pass the content helpers for analysis)
            content(doc) {
                return 'simple html representation of your doc'; // (OPTIONAL) If your site is generated after Sanity content updates you can use this for better real time feedback
            },
            title(doc) {
                return 'page title'; // (OPTIONAL) return page title otherwise inferred from scrape
            },
            description(doc) {
                return 'page description'; // (OPTIONAL) return page description otherwise inferred from scrape
            },
            locale(doc) {
                return 'page locale'; // (OPTIONAL) return page locale otherwise inferred from scrape
            },
            contentSelector: 'body' // (OPTIONAL) option to finetune where Yoast will look for the content. (only applicable for scraping without content function)
        },
    }]
}
```
3. Make sure to enable CORS for the Sanity domain otherwise the plugin won't be able to fetch your content.
4. (OPTIONAL) You can add a file called `seo-tools.json` in your studio's `config` folder. Following options can be set:
```
{
    "focus_keyword_required": false, // makes the focus_keyword field required
    "focus_synonyms_required": false, // makes the focus_synonyms field required
    "seo_title_required": false, // makes the seo_title field required
    "meta_description_required": false // makes the meta_description field required
}
```

## What does it look like?
![SEO tools](https://raw.githubusercontent.com/LiamMartens/sanity-plugin-seo-tools/master/doc/img/plugin.gif)

## Available parts for implementation
### part:sanity-plugin-seo-tools/schema-customizer
It is possible to implement this studio part ([The Parts System](https://www.sanity.io/docs/parts)) to customize the object schema provided by the `seo-tools` plugin.

To do this you will need to add an implementation to your studio's `sanity.json`:
```json
{
    ...,
    "parts": [
        {
        "implements": "part:sanity-plugin-seo-tools/schema-customizer",
        "path": "./schemaCustomizer.js"
        }
    ]
}
```

And implement the `schemaCustomizer.js` file; eg:
```js
export default (schema) => {
    schema.fields.push({
        name: 'my_field',
        title: 'My field',
        type: 'string',
    })
    return schema;
}
```


## Common issues
### CORS
The plugin will try to load your `{baseUrl}/{slug}` URL, but this is most likely blocked by CORS because we need to fetch it from the browser. There are 2 ways to solve it
1. Allow CORS from your Sanity studio domain
2. Disable `fetchRemote` altogether and provide all methods manually
### Can't resolve "config:seo-tools"
In v1.1.0 we added a config file. To get rid of this error when upgrading an instance simply add a file called `seo-tools.json` to your `config` folder and set it to an empty object `{}`.