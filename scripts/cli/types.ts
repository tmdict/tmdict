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
    name: {
      /** En, Ja, Zh */
      [key: string]: string;
    };
    /** Data attr name */
    [key: string]: {
      /** En, Ja, Zh */
      [key: string]: string;
    };
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

export interface DataAttribute {
  /** En, Ja, Zh */
  [key: string]: string;
}

export interface CommonAttribute extends DataAttribute {
  id: string;
  type: string;
}

export interface ParsedAttribute {
  name: {
    /** En, Ja, Zh */
    [key: string]: string;
  };
  /** Attr name */
  [key: string]: CommonAttribute[] | DataAttribute;
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
  en?: string;
  ja?: string;
  jaRow?: string;
  uid: string;
  page?: string;
  attr: ParsedAttribute;
  layout: LayoutAttribute;
}

export interface Content {
  html: string;
  data: {
    parent: string;
    id: string;
    language: string;
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
  entryType: string;
  attribute: EntryMetadata;
  content: EntryContent[];
}

export interface Filter {
  type: string;
  filter: string[];
  contentFilter?: string[];
  name: {
    /** En, Ja, Zh */
    [key: string]: string;
  };
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
  name: {
    /** En, Ja, Zh */
    [key: string]: string;
  };
  source: string[];
  work: string[];
  uid: string;
  content?: ListContent[];
  alphabet?: string[];
  "hiragana-row"?: string[];
  star?: string[];
  class?: string[];
  en?: string;
  ja?: string;
  jaRow?: string;
  category?: string[];
}

export interface I18n {
  /** Attr type */
  [key: string]: {
    /** Attr name */
    [key: string]: {
      /** En, Ja, Zh */
      [key: string]: string;
    };
  };
}

export interface FilterList {
  list: List[];
  i18n: I18n;
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
  name: {
    /** En, Ja, Zh */
    [key: string]: string;
  };
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
      [key: string]: {
        en: string;
        ja: string;
        zh: string;
      };
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
