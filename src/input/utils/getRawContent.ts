import axios from "axios";
import { LangCultureMap } from "../constants";

type TOptions<D> = {
  baseUrl: string | ((doc: D) => string);
  fetchRemote?: boolean;
  contentSelector?: string;
  slug: (doc: D) => string;
  content?: (doc: D) => string;
  title?: (doc: D) => string;
  description?: (doc: D) => string;
  locale?: (doc: D) => string;
};

export const getRawContent = async <D = any>(
  document: D,
  options: TOptions<D>
) => {
  const baseUrl = (() => {
    const url =
      typeof options.baseUrl === "string"
        ? options.baseUrl
        : options.baseUrl(document);
    return url.replace(/\/+$/, "");
  })();
  const slug = options.slug(document);
  const url = baseUrl + "/" + slug;

  // fetch remote document if requested
  let doc: Document | null = null;
  if (options.fetchRemote !== false) {
    const remote = await axios.get(url);
    const content = remote.data;
    const parser = new DOMParser();
    doc = parser.parseFromString(content, "text/html");
    Array.from(doc.body.querySelectorAll("script")).forEach((s) => s.remove());
  } else if (!options.content || !options.title || !options.description) {
    throw new Error(
      "When `fetchRemote` is disabled you need to provide all Sanity document based methods to retrieve the content for analysis."
    );
  }

  // get "normalized" langculture
  let langCulture = options.locale
    ? options.locale(document)
    : doc && doc.documentElement.lang
    ? doc.documentElement.lang
    : "en";
  if (!langCulture.includes("-"))
    langCulture =
      LangCultureMap?.[
        langCulture.toLowerCase() as keyof typeof LangCultureMap
      ] ?? "en-US";

  // get content stuff
  const title = options.title ? options.title(document) : doc?.title ?? "";
  const description = (() => {
    if (options.description) return options.description(document);
    const el = doc?.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (el) return el.content;
    return "";
  })();

  // build final raw content
  const rawContent = (() => {
    if (doc) {
      const contentBySelector = options.contentSelector
        ? doc.querySelector(options.contentSelector)
        : doc.body;
      return (contentBySelector || doc.body).innerHTML;
    }
    if (options.content) {
      return options.content(document);
    }
    return "";
  })();

  return {
    slug,
    url,
    title,
    description,
    langCulture,
    rawContent,
  };
};
