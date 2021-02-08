import config from 'config:seo-tools';
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
            type: 'string',
            validation: config.focus_keyword_required ? Rule => Rule.required().error('Focus keyword is required') : undefined
        },
        {
            title: 'Focus keyword synonyms',
            name: 'focus_synonyms',
            type: 'array',
            of: [{ type: 'string' }],
            validation: config.focus_synonyms_required ? Rule => Rule.required().error('Enter at least one focus keyword synonym') : undefined
        },
        {
            title: 'SEO Title',
            name: 'seo_title',
            type: 'string',
            validation: config.seo_title_requied ? Rule => Rule.required().error('SEO title is required') : undefined
        },
        {
            title: 'Meta description',
            name: 'meta_description',
            type: 'text',
            validation: config.meta_description_required ? Rule => Rule.required().error('Meta description is required') : undefined
        }
    ]
}