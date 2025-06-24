export type AppConfig = {
  paths: AppPaths
  content: {
    [key: string]: Filter
  }
  sources: {
    site: string[],
    book: string[]
  }
  app: {
    lang: {
      [key: string]: {
        id: string
        name: string
      }
    }
    i18n: {
      [key: string]: {
        [key: string]: any
      }
    }
  }
}

export interface AppPaths {
  css: {
    path: string
    files: string[]
  }
  data: string
}

export interface AttributeData {
  [key: string]: {
    [key: string]: Attribute
  }
}

export interface Attribute {
  id: string
  type: string
  en?: string
  ja?: string
  jaRow?: string
  uid?: string
  weight?: number
  releaseDate?: string
  page?: string
  attribute: {
    [key: string]: string | string[]
  }
  data: {
    [key: string]: {
      [key: string]: string
    }
  }
  layout?: string[][]
}

export interface PreparedAttribute {
  id: string
  type: string
  [key: string]: string
}

export interface LayoutAttribute {
  [key: string]: {
    [key: string]: string
  }[]
}

export interface EntryMetadata {
  id: string
  type: string
  en?: string
  ja?: string
  jaRow?: string
  uid: string
  page?: string
  attr: any
  layout: LayoutAttribute
}

export interface RawContent {
  [key: string]: {
    content: string
    data: {
      parent: string
      id: string
      language: string
      weight: number
      source?: string
      translation?: string
      img?: string
      name?: string
      profile?: boolean
      category?: string[]
    }
    isEmpty: boolean
    excerpt: string
    html: string
  }[]
}

export interface EntryContent {
  parent: string
  source: string
  id: string
  weight: number
  img: string
  profile: boolean
  category: string[]
  i18n: {
    [key: string]: {
      name: {
        id: string
        name: string
      }
      source: {
        id: string
        name: string
      }
      category: {
        id: string
        name: string
      }[]
      img: string
      translation: string
      html: string
    }
  }
}

export interface EntryData {
  entryType: string
  attribute: EntryMetadata
  content: EntryContent[]
}

export interface Filter {
  type: string
  filter: string[]
  contentFilter?: string[]
  name: {
    [key: string]: string
  }
}

export interface ListContent {
  [key: string]: {
    id: string
    source: string
    html: string
  }
}

export interface List {
  id: string
  name: {
    [key: string]: string
  }
  source: string[]
  work: string[]
  uid: string
  content?: ListContent[]
  alphabet?: string[]
  "hiragana-row"?: string[]
  star?: string[]
  class?: string[]
  en?: string
  ja?: string
  jaRow?: string
  category?: string[]
}

export interface I18n {
  [key: string]: {
    [key: string]: {
      // en, ja, zh
      [key: string]: string
    }
  }
}

export interface FilterList {
  list: List[]
  i18n: I18n
}

export interface AppData {
  [key: string]: {
    entries: {
      [key: string]: {
        data: EntryData
        filepath: string
      }
    }
    filterlist: FilterList
  }
}

export interface BookEntry extends EntryContent {
  name: {
    [key: string]: string;
  };
}

export interface Book {
  glossary: Attribute
  source: Attribute
  entries: BookEntry[]
}

export interface BookData {
  [key: string]: Book
}

export interface SearchData {
 title: string
 lang: string
 url: string
 type: string
 text: string
}

export interface StaticEntryPaths {
  [key: string]: {
    lang: string;
    glossary?: string;
    profile?: string;
  }[]
}

export interface Sitemap {
  changefreq: string;
  priority: number;
  url: string;
}
