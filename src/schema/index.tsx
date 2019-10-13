import Input from '../input';

export default {
    name: 'seo-tools',
    type: 'object',
    title: 'SEO Tools',
    inputComponent: Input,
    fields: [
        {
            title: 'Focus keyword',
            name: 'focus_keyword',
            type: 'string'
        },
        {
            title: 'Focus keyword synonyms',
            name: 'focus_synonyms',
            type: 'array',
            of: [{ type: 'string' }]
        },
        {
            title: 'SEO Title',
            name: 'seo_title',
            type: 'string'
        },
        {
            title: 'Meta description',
            name: 'meta_description',
            type: 'text'
        }
    ]
}