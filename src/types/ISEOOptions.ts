export interface ISEOOptions {
  baseUrl: string | ((doc: any) => string);
  slug: (doc: any) => string;
  fetchRemote?: boolean;
  content?: (doc: any) => string;
  title?: (doc: any) => string;
  description?: (doc: any) => string;
  locale?: (doc: any) => string;
  contentSelector?: string;
}
