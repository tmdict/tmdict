import * as _ from 'lodash'
import { builder } from './builder'
import { loader } from './loader'
import { parser } from './parser'
import { AppConfig, AttributeData, EntryContent, EntryData, Search } from './types'

export default class App {
  /** Generates Chaldea app and site */
  chaldea = (appConfig: AppConfig, templates: any, env: string): any => {
    console.log('\nBuilding: chaldea')

    // Build assets, img, css, etc.
    builder.buildAssets(appConfig.paths, appConfig.paths.img)
    builder.buildCss(appConfig.paths, appConfig.paths.css)

    // Build attributes and content
    const attrData: AttributeData = loader.loadAttrData(appConfig.paths)
    const contentData: any = loader.loadContentData(appConfig.paths)

    // Output JS used by the App
    builder.toJsExport(`${appConfig.paths.src}/__tmp/data/constants.js`, appConfig.app, 'APP')

    // Build entries for each filter type
    Object.keys(appConfig.filterlist).forEach((filter: string) => {
      // Build entries
      console.log('Building entry data')
      // Extract attr content
      const attrContent: any = { [filter]: {} }
      contentData[`attribute.${filter}`].forEach((entry: any) => {
        if (!attrContent[filter][entry.data.id]) {
          attrContent[filter][entry.data.id] = { content: {} }
        }
        attrContent[filter][entry.data.id].source = entry.data.source
        attrContent[filter][entry.data.id].content[entry.data.language] = entry.html
      })

      let count = 0
      const parsedData = Object.keys(attrData[filter]).reduce(
        (acc, entryId: string) => {
          const entryDataRaw: EntryData = parser.parseEntry(entryId, filter, attrData, env, contentData, attrContent)
          const entryData: EntryData = parser.filterContentBySource(entryDataRaw, appConfig.content)
          const entryPath = `${entryData.attribute.type}/${entryData.attribute.id}`
          const tmp = `${appConfig.paths.src}/__tmp`
          // Generates JSON data (as js files) to be consumed by the js app
          builder.toJsExport(`${tmp}/data/${entryPath}.js`, entryData)
          // Generates js file for the app
          builder.toTemplate(templates['entry.js'].replace(/^ +/gm, ''), `${tmp}/js/${entryPath}.js`, {
            path: entryPath,
          })
          // Generates HTML for Entries
          builder.toTemplate(templates['entry.html'], `${appConfig.paths.dist}/${entryPath}.html`, {
            id: entryData.attribute.id,
            type: entryData.attribute.type,
            level: '../',
          })
          count++
          // Add parsed data to filterlist and i18n collection
          const entryAttrFilterlist = parser.parseAttributeFilterlist(
            entryId,
            entryData,
            attrData,
            appConfig.filterlist[filter]
          )
          const entryAttrI18n = parser.parseFilterlistI18n(entryId, entryData, attrData, appConfig.filterlist[filter])
          return {
            filterlist: acc.filterlist.concat(entryAttrFilterlist),
            i18n: _.merge(acc.i18n, entryAttrI18n),
          }
        },
        {
          filterlist: [], // Initial filterlist content array
          i18n: {}, // Initial filterlist i18n attribute map
        }
      )
      console.log(`...Built ${count} ${filter} data/js/html files`)

      // Build filterlist
      builder.buildAppData(
        appConfig.paths,
        templates,
        {
          attribute: appConfig.filterlist[filter],
          content: parsedData.filterlist,
          i18n: parsedData.i18n,
          env: env,
        },
        '../',
        filter
      )
    })

    // Build main page
    const pageData: EntryData = Object.keys(attrData['page'])
      .map((id: string) => parser.parseEntry(id, 'page', attrData, env, contentData))
      .filter((p) => p.attribute.id === 'chaldea-app')[0]
    builder.buildAppData(appConfig.paths, templates, pageData, './')

    // Build missing content page
    const missing = parser.getMissingContent(appConfig.content, ['servant', 'ce'])
    builder.buildAppData(
      appConfig.paths,
      templates,
      {
        attribute: {
          type: 'missing',
        },
        missing: missing,
        env: env,
      },
      '../',
      'missing'
    )
  }

  /** Generates TMdict app and site */
  tmdict = (appConfig: AppConfig, templates: any, env: string): any => {
    console.log('\nBuilding: tmdict')

    // Build assets, img, css, etc.
    builder.buildAssets(appConfig.paths, appConfig.paths.img)
    builder.buildCss(appConfig.paths, appConfig.paths.css)
    builder.buildRaw(appConfig.paths, appConfig.content)

    // Build attributes
    const attrData: AttributeData = loader.loadAttrData(appConfig.paths)

    // Output JS used by the App
    builder.toJsExport(`${appConfig.paths.src}/__tmp/data/constants.js`, appConfig.app, 'APP')

    // Preoprocess navigation data
    const ext = env === 'production' ? '' : '.html'
    const nav = parser.parseNav(attrData)
    const contentData: any = loader.loadContentData(appConfig.paths)

    // Build pages
    console.log(`Building static html pages`)
    const pageData = Object.keys(attrData['page'])
      .map((id: string) => parser.parseEntry(id, 'page', attrData, env, contentData))
      .filter((p) => p.attribute.id === 'tmdict')
    pageData[0].content.forEach((page) => {
      Object.keys(page.i18n).forEach((lang) => {
        builder.buildPageWithSidebarHtml(appConfig, templates, page, lang, nav, ext)
      })
    })
    // Build entries
    console.log(`Parsing entries`)
    let count = 0
    const parsedData = Object.keys(attrData.glossary).reduce(
      (acc, entryId: string) => {
        const entryDataRaw: EntryData = parser.parseEntry(entryId, 'glossary', attrData, env, contentData)
        const entryData: EntryData = parser.filterContentBySource(entryDataRaw, appConfig.content)
        // Add parsed data to sidebar, filterlist and i18n collection
        const sidebar = parser.parseEntriesIntoGroup(
          'hiragana',
          entryData.attribute.ja,
          [{ id: 'category', joinBy: '/' }],
          entryData,
          attrData,
          Object.keys(appConfig.app.lang),
          acc.sidebar
        )
        const entryAttrFilterlist = parser.parseAttributeFilterlist(
          entryId,
          entryData,
          attrData,
          appConfig.filterlist['glossary']
        )
        // Append Work attr
        const workAttr = entryAttrFilterlist['source']
          .map((src: string) => attrData['source'][src].attribute['work'])
          .filter((val: string, i: number, arr: string[]) => arr.indexOf(val) == i) // Dedupe
        const entryFilterlist = _.merge(entryAttrFilterlist, { work: workAttr })
        const entryAttrI18n = parser.parseFilterlistI18n(entryId, entryData, attrData, appConfig.filterlist['glossary'])
        count++
        return {
          entries: acc.entries.concat(entryData),
          sidebar: sidebar,
          filterlist: acc.filterlist.concat(entryFilterlist),
          i18n: _.merge(acc.i18n, entryAttrI18n),
        }
      },
      {
        entries: [], // Collection of entry data
        sidebar: {}, // Ongoing collection of sidebar data
        filterlist: [], // Initial filterlist content array
        i18n: {}, // Initial filterlist i18n attribute map
      }
    )
    console.log(`...Parsed ${count} entries`)

    // Append work i18n data
    parser.appendI18n(parsedData.i18n, 'work', attrData, 'work')
    parsedData.i18n['work'] = {}
    Object.keys(attrData['work']).forEach((work) => {
      parsedData.i18n['work'][work] = attrData['work'][work].data.name
    })
    // Append nav en/ja i18n data
    parser.appendI18n(parsedData.i18n, 'en', attrData, 'alphabet')
    parser.appendI18n(parsedData.i18n, 'ja', attrData, 'hiragana')
    parser.appendI18n(parsedData.i18n, 'jaRow', attrData, 'hiragana-row')

    // Sort entries in sidebar
    const sortedSidebar = parser.sortGroupedEntries(parsedData.sidebar)

    // Build entries HTML and aggregate search data
    console.log(`Building static html entries`)
    const searchData: Search[] = []
    const sitemap: { [key: string]: any }[] = []
    count = 0
    parsedData.entries.forEach((entryData: EntryData) => {
      Object.keys(entryData.attribute.attr.name).forEach((lang: string) => {
        builder.buildEntryWithSidebarHtml(
          appConfig,
          templates,
          entryData,
          parsedData.i18n,
          lang,
          nav,
          sortedSidebar,
          ext
        )
        // Aggregate search data
        const content = entryData.content
          .map((c: EntryContent) => {
            return c.i18n[lang] ? c.i18n[lang].html : ''
          })
          .join(' ')
        searchData.push({
          text: parser.parseSearchMarkup(content),
          title: entryData.attribute.attr.name[lang],
          url: `https://www.tmdict.com/${lang}/${entryData.attribute.ja}.${entryData.attribute.id}${ext}`,
        })
        sitemap.push({
          changefreq: 'monthly',
          priority: 1.0,
          url: `https://www.tmdict.com/${lang}/${entryData.attribute.ja}.${entryData.attribute.id}${ext}`,
        })
      })
      count++
    })
    console.log(`...Built ${count} html files`)
    builder.buildSearchData(appConfig.paths, searchData)
    console.log(`...Built search data`)
    builder.buildSitemap(appConfig.paths, sitemap)
    console.log(`...Built sitemap`)

    // Build filterlist
    Object.keys(appConfig.app.lang).forEach((lang: string) => {
      // tmdict app only displays one language
      const fl = parsedData.filterlist.map((entry) => {
        return _.merge(_.omit(entry, 'name'), { name: entry.name[lang] })
      })
      builder.buildAppData(
        appConfig.paths,
        templates,
        {
          attribute: _.merge(appConfig.filterlist['glossary'], { lang: lang }),
          content: fl,
          i18n: parsedData.i18n,
          env: env,
        },
        '../',
        lang
      )
    })
  }

  /** Generates TMdict Book app */
  book = (appConfig: AppConfig, templates: any, env: string): any => {
    console.log('\nBuilding: book')

    // Build assets, img, css, etc.
    builder.buildAssets(appConfig.paths, appConfig.paths.img)
    builder.buildCss(appConfig.paths, appConfig.paths.css)

    // Build attributes
    const attrData: AttributeData = loader.loadAttrData(appConfig.paths)

    // Output JS used by the App
    builder.toJsExport(`${appConfig.paths.src}/__tmp/data/constants.js`, appConfig.app, 'APP')

    // Preoprocess navigation data
    const contentData: any = loader.loadContentData(appConfig.paths)

    // Build app
    console.log(`Parsing entries`)
    let count = 0
    const parsedData: { [key: string]: any } = {}
    Object.keys(attrData.glossary).forEach((entryId: string) => {
      const entryData: EntryData = parser.parseEntry(entryId, 'glossary', attrData, env, contentData)
      // Filter for only specific glossary books
      parser.filterContentBySource(entryData, appConfig.content).content.forEach((entryContent: EntryContent) => {
        // If key for current source doesn't exist, add it
        if (!(entryContent.source in parsedData)) {
          parsedData[entryContent.source] = {
            glossary: attrData['content-id'][entryContent.id],
            source: attrData.source[entryContent.source],
            entries: [],
          }
        }
        parsedData[entryContent.source].entries.push(
          _.merge(entryContent, { name: attrData.glossary[entryContent.parent].data.name })
        )
      })
      count++
    })
    console.log(`...Parsed ${count} glossaries`)

    // Sort entries in each book
    Object.keys(parsedData).forEach((id: string) => {
      parsedData[id].entries.sort((a: EntryContent, b: EntryContent) => a.weight - b.weight)
    })

    // Build book data
    builder.buildAppData(
      appConfig.paths,
      templates,
      Object.keys(parsedData)
        .map((id) => parsedData[id])
        .sort((a: any, b: any) => {
          return a.source.weight - b.source.weight
        }),
      ''
    )
  }
}

export const app = new App()
