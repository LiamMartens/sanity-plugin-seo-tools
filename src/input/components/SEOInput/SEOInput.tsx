import React from 'react';
import PatchEvent from '@sanity/form-builder/lib/PatchEvent';
import {
  studioTheme,
  Card,
  Container,
  Heading,
  ThemeProvider,
  Stack,
  TabList,
  Tab,
} from '@sanity/ui';
import { BoxSpinner } from '../BoxSpinner';
import { Tabs } from '../../constants';
import { getRawContent } from '../../utils/getRawContent';
import { useDebouncedCallback } from 'use-debounce';
import { SEOInputSeoTab } from './SEOInputSeoTab';
import { getYoastInsightsForContent } from '../../utils';
import { SEOInputReadabilityTab } from './SEOInputReadabilityTab';
import { IField, ISEOOptions, IType } from '../../../types';
import { FormBuilderInput } from 'part:@sanity/form-builder';
import { setIfMissing } from 'part:@sanity/form-builder/patch-event';

type Props = {
  document: any & { _type: string; };
  type: IType<ISEOOptions>;
  value?: {
    focus_keyword?: string;
    focus_synonyms?: string[];
  };
  onChange: (...args: any[]) => void;
  onBlur: (...args: any[]) => void;
  onFocus: (...args: any[]) => void;
}

const SEOInputComponent: React.FunctionComponent<Props> = ({ type, value, document }) => {
  const YoastSEO = React.useRef(require('yoastseo') as typeof import('yoastseo'));
  const [initialAudit, setInitialAudit] = React.useState(true);
  const [auditOngoing, setAuditOngoing] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(Tabs.SEO);
  const [yoastInsights, setYoastInsights] = React.useState<ReturnType<typeof getYoastInsightsForContent> | null>(null);

  const performYoastCheck = useDebouncedCallback(async () => {
    setAuditOngoing(true);
    try {
      const { options } = type;
      const { slug, url, title, description, langCulture, rawContent } = await getRawContent(document, {
        baseUrl: options.baseUrl,
        fetchRemote: options.fetchRemote,
        contentSelector: options.contentSelector,
        slug: options.slug,
        content: options.content,
        title: options.title,
        description: options.description,
        locale: options.locale,
      });
      const insights = getYoastInsightsForContent(YoastSEO.current, rawContent, {
        keyword: value?.focus_keyword || '',
        synonyms: value?.focus_synonyms || [],
        title,
        description,
        langCulture,
        url: slug, permalink: url,
      });
      setYoastInsights(insights);
    } catch (err) {
      console.error(err);
    } finally {
      setInitialAudit(false);
      setAuditOngoing(false);
    }
  }, 2000);

  React.useEffect(() => {
    performYoastCheck();
  }, [value, document]);

  return (
    <Container>
      <Card style={{ position: 'relative' }} padding={4} shadow={2}>
        <Stack space={4}>
          <Heading as="h3" size={1}>SEO Tools</Heading>
          <Container>
            {initialAudit ? (
              <BoxSpinner />
            ) : (
              <>
                {auditOngoing && (
                  <BoxSpinner overlay />
                )}
                <TabList space={1}>
                  <Tab id={Tabs.SEO} aria-controls={Tabs.SEO} label="SEO" selected={selectedTab === Tabs.SEO} onClick={() => setSelectedTab(Tabs.SEO)} />
                  <Tab id={Tabs.READABILITY} aria-controls={Tabs.READABILITY} label="Readability" selected={selectedTab === Tabs.READABILITY} onClick={() => setSelectedTab(Tabs.READABILITY)} />
                </TabList>
                <SEOInputSeoTab value={value} hidden={selectedTab !== Tabs.SEO} insights={yoastInsights ?? undefined} />
                <SEOInputReadabilityTab value={value} hidden={selectedTab !== Tabs.READABILITY} insights={yoastInsights ?? undefined} />
              </>
            )}
          </Container>
        </Stack>
      </Card>
    </Container>
  );
}

export class SEOInput extends React.Component<Props> {
  public focus() {
    // @README irrelevant
  }

  private handleFieldChange = (field: IField, fieldPatchEvent: PatchEvent) => {
    const { type, onChange } = this.props
    onChange(fieldPatchEvent.prefixAll(field.name).prepend(setIfMissing({ _type: type.name })))
  }

  public render() {
    const { type, value, onFocus, onBlur, onChange } = this.props;
    const { fields } = type;

    return (
      <ThemeProvider theme={studioTheme}>
        <Stack space={4}>
          <SEOInputComponent {...this.props} />
          <Container>
            <Card style={{ position: 'relative' }} padding={4} shadow={2}>
              <Stack space={3}>
                {fields.map(field => (
                  <div key={field.name}>
                    <FormBuilderInput
                      key={field.name}
                      type={field.type}
                      level={type.level}
                      path={[field.name]}
                      value={value ? value[field.name as keyof typeof value] : undefined}
                      onChange={(patchEvent: any) => this.handleFieldChange(field, patchEvent)}
                      onBlur={onBlur}
                      onFocus={onFocus}
                    />
                  </div>
                ))}
              </Stack>
            </Card>
          </Container>
        </Stack>
      </ThemeProvider>
    );
  }
}