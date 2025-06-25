export type Lang = 'en' | 'ja' | 'zh';
export type I18n = Record<Lang, string>;

export interface Attribute {
  id: string;
  type: string;
  en?: string;
  ja?: string;
  jaRow?: string;
  uid?: string;
  weight?: number;
  releaseDate?: string;
  page?: string;
  attribute: {
    /** Common attr name */
    [key: string]: string | string[];
  };
  data: {
    name: I18n;
    /** Data attr name */
    [key: string]: I18n;
  };
  layout?: string[][];
}

export interface AttributeData {
  /** Attr type */
  [key: string]: {
    /** Attr name */
    [key: string]: Attribute;
  };
}

export interface Content {
  html: string;
  data: {
    parent: string;
    id: string;
    language: Lang;
    weight: number;
    source?: string;
    translation?: string;
    img?: string;
    name?: string;
    profile?: boolean;
    category?: string[];
  };
  /** Loaded fields e.g. content, isEmpty, excerpt */
  [key: string]: any;
}

export interface ContentData {
  /** Content parent (attr id) */
  [key: string]: Content[];
}

export interface DataAttr {
  /** En, Ja, Zh */
  [key: string]: string;
}

export interface CommonAttr extends DataAttr {
  id: string;
  type: string;
}

export interface ParsedAttribute {
  name: I18n;
  /** Attr name */
  [key: string]: CommonAttr[] | DataAttr;
}

export interface LayoutAttribute {
  /** En, Ja, Zh */
  [key: string]: {
    /** Attr name */
    [key: string]: string;
  }[];
}

export interface EntryMetadata {
  id: string;
  type: string;
  uid: string;
  name: I18n;
  layout: LayoutAttribute;
  en?: string;
  ja?: string;
  hiragana?: string;
  page?: string;
}

export interface EntryContent {
  parent: string;
  source: string;
  id: string;
  weight: number;
  img: string;
  profile: boolean;
  category: string[];
  i18n: {
    /** En, Ja, Zh */
    [key: string]: {
      name: {
        id: string;
        name: string;
      };
      source: {
        id: string;
        name: string;
      };
      category: {
        id: string;
        name: string;
      }[];
      img: string;
      translation: string;
      html: string;
    };
  };
}

export interface EntryData {
  attribute: EntryMetadata;
  content: EntryContent[];
}

export interface Filter {
  type: string;
  filter: string[];
  contentFilter?: string[];
  name: I18n;
}

export interface ListContent {
  /** En, Ja, Zh */
  [key: string]: {
    id: string;
    source: string;
    html: string;
  };
}

export interface List {
  id: string;
  name: I18n;
  source: string[];
  work: string[];
  uid: string;
  content?: ListContent[];
  star?: string[];
  class?: string[];
  en?: string;
  ja?: string;
  hiragana?: string;
  category?: string[];
}

export interface I18nData {
  /** Attr type */
  [key: string]: {
    /** Attr name */
    [key: string]: I18n;
  };
}

export interface FilterList {
  list: List[];
  i18n: I18nData;
}

export interface AppData {
  /** Glossary, Profile */
  [key: string]: {
    entries: {
      /** Entry id */
      [key: string]: {
        data: EntryData;
        filepath: string;
      };
    };
    filterlist: FilterList;
  };
}

export interface BookEntry extends EntryContent {
  name: I18n;
}

export interface Book {
  glossary: Attribute;
  source: Attribute;
  entries: BookEntry[];
}

export interface BookData {
  /** Entry source */
  [key: string]: Book;
}

export interface SearchData {
  title: string;
  lang: string;
  url: string;
  type: string;
  text: string;
}

export interface StaticEntryPaths {
  /** Glossary, Profile */
  [key: string]: {
    lang: string;
    /** Glossary, Profile */
    [key: string]: string;
  }[];
}

export interface Sitemap {
  changefreq: string;
  priority: number;
  url: string;
}

export type AppConfig = {
  paths: AppPaths;
  content: {
    /** Glossary, Profile */
    [key: string]: Filter;
  };
  sources: {
    site: string[];
    book: string[];
  };
  app: {
    lang: {
      /** En, Ja, Zh */
      [key: string]: {
        id: string;
        name: string;
      };
    };
    i18n: {
      /** Site text */
      [key: string]: I18n;
    };
  };
}

export interface AppPaths {
  css: {
    path: string;
    files: string[];
  };
  data: string;
}
