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

export interface FilterList {
  attribute: Filter
  content: {
    [key: string]: any
  }[]
  i18n: any
  env: string
}
