export type AppConfig = {
  paths: AppPaths
  filterlist: {
    [key: string]: Filter
  }
  content: string[]
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
  assets: string
  css: string[]
  data: string
  dist: string
  img: string[]
  src: string
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
  img?: EntryImg[]
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

export interface EntryImg {
  id: string
  src: string
  weight: number
}

export interface EntryMetadata {
  id: string
  type: string
  en?: string
  ja?: string
  jaRow?: string
  uid: string
  img?: EntryImg[]
  page?: string
  attr: any
  layout: LayoutAttribute
}

export interface EntryContent {
  parent: string
  source: string
  id: string
  weight: number
  img: string
  profile: number
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

export interface FilterList {
  attribute: Filter
  content: {
    [key: string]: any
  }[]
  i18n: any
  env: string
}

export interface GroupedEntryAttr {
  id: string
  joinBy: string
}

export interface MissingContent {
  type: string
  id: string
  name: string
  sectionId: string
  sectionName: string
  source: string
  lang: string
}

export interface Search {
  [key: string]: {
    text: string
    title: string
    url: string
  }[]
}
