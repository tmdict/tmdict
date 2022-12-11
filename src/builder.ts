import * as fs from 'fs-extra'
import * as handlebars from 'handlebars'
import * as sass from 'sass'
import * as Jimp from 'jimp';
import { SitemapStream, streamToPromise } from 'sitemap'

import { AppConfig, AppPaths, EntryContent, EntryData } from './types'

/**
 * @param content Content to be written to output file
 * @param path Directory + filename of output file
 */
function outputFile(content: string, path: string): void {
  fs.outputFile(path, content, (err: Error) => {
    if (err) {
      return console.log(err)
    }
  })
}

function buildOptimizedImg(dir: string, output: string): void {
  fs.readdir(dir, (err, files) => {
    if (err) console.log(`[ ERROR fs/jimp ] ${err}`)
    else {
      files = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
      let count = 0
      files.forEach((file) => {
        count += 1
        Jimp.read(`${dir}/${file}`)
          .then((image: any) => {
            const outfile = `${file.substr(0, file.lastIndexOf('.'))}.jpg`
            image
              .quality(60) // Set JPEG quality (60)
              .write(`${output}/${outfile}`)
          })
          .catch((err: any) => {
            console.error(`[ ERROR jimp/${dir} ] ${err}`)
          })
      })
      console.log(`Optimized ${count} ${dir} images`)
    }
  })
}

export default class Builder {
  /** Generate JSON data with `name` as key */
  toJsExport = (path: string, data: any, name = 'data'): void => {
    try {
      const output = `export const ${name} = ${JSON.stringify(data)}; export default ${name};`
      outputFile(output, path)
    } catch (err) {
      console.log(`[ERROR toJsExport] [${path}]: ${err}`)
    }
  }

  /** Generates a file for the given template and data */
  toTemplate = (template: string, path: string, data: any): void => {
    try {
      handlebars.registerHelper('equals', (a, b) => {
        return a === b
      })
      const output = handlebars.compile(template)(data)
      outputFile(output, path)
    } catch (err) {
      console.log(`[ERROR toTemplate]: [${JSON.stringify(data)}]${err}`)
    }
  }

  /** Synchronously copy static assets from `source` dir to `output` dir */
  buildAssets = (paths: AppPaths, img: string[] = [], optimize = false): void => {
    console.log(`Building assets`)
    fs.copySync(`${paths.src}/${paths.assets}`, paths.dist, { overwrite: true })
    img.forEach((imgDir) => {
      if (optimize) {
        buildOptimizedImg(`${paths.data}/${imgDir}`, `${paths.dist}/src/${imgDir}`)
      } else {
        fs.copySync(`${paths.data}/${imgDir}`, `${paths.dist}/src/${imgDir}`, { overwrite: true })
      }
    })
  }

  /** Compiles SCSS into CSS */
  buildCss = (paths: AppPaths, scss: string[]): void => {
    console.log(`Building css`)
    scss.forEach((file) => {
      try {
        const result = sass.compile(`${paths.src}/css/${file}.scss`, { style: 'compressed' })
        outputFile(result.css.toString(), `${paths.dist}/src/css/${file}.css`)
      } catch (err) {
        console.log(`[ERROR css]: ${err}`)
      }
    })
  }

  /** Generate raw data to `output` dir */
  buildRaw = (paths: AppPaths, content: string[] = []): void => {
    console.log(`Building raws`)
    content.forEach((source) => {
      fs.copySync(`${paths.data}/content/${source}`, `${paths.dist}/raw/${source}`, { overwrite: true })
    })
  }

  /** Generates data for app and filterlist */
  buildAppData = (
    paths: AppPaths,
    templates: { [key: string]: string },
    data: any,
    level: string,
    path = '.'
  ): void => {
    console.log(`Building ${path} app data`)
    const templateData = { level: level, path: path }
    const tmp = `${paths.src}/__tmp`
    this.toTemplate(templates['app.html'], `${paths.dist}/${path}/index.html`, templateData)
    this.toTemplate(templates['app.js'].replace(/^ +/gm, ''), `${tmp}/js/${path}/app.js`, templateData)
    this.toJsExport(`${tmp}/data/${path}/app.js`, data)
  }

  /** Build static HTML page with sidebar */
  buildPageWithSidebarHtml = (
    appConfig: AppConfig,
    templates: { [key: string]: string },
    page: EntryContent,
    lang: string,
    nav: any,
    ext: string
  ): void => {
    const path = `${appConfig.paths.dist}/${lang}`
    this.toTemplate(templates['page.html'], `${path}/${page.id}.html`, {
      attribute: {
        id: page.id,
        name: page.i18n[lang].name.name,
      },
      content: page.i18n[lang].html,
      sidebar: {
        fname: page.i18n.en.name.name[0],
        lname: page.i18n.en.name.name.substring(1),
        content: appConfig.app.i18n.side[lang],
      },
      nav: nav,
      lang: lang,
      app: appConfig.app,
      level: '../',
      ext: ext,
    })
  }

  /** Build static HTML entry with sidebar of all related entries */
  buildEntryWithSidebarHtml = (
    appConfig: AppConfig,
    templates: { [key: string]: string },
    entryData: EntryData,
    i18n: any,
    lang: string,
    nav: any,
    sidebar: any,
    ext: string
  ): void => {
    const en = entryData.attribute.en
    const ja = entryData.attribute.ja
    const jaRow = entryData.attribute.jaRow
    // Get i18n content for each content[] for template
    const entryContent = entryData.content.map((c) => c.i18n[lang])
    const entryPath = `${lang}/${ja}.${entryData.attribute.id}`
    // Generates HTML for Entries
    this.toTemplate(templates['entry.html'], `${appConfig.paths.dist}/${entryPath}.html`, {
      attribute: {
        id: entryData.attribute.id,
        name: entryData.attribute.attr.name[lang],
        alphabet: { id: en, name: i18n.alphabet[en][lang] },
        hiragana: { id: ja, name: i18n.hiragana[ja][lang] },
        hiraganaRow: { id: jaRow, name: i18n['hiragana-row'][jaRow][lang] },
      },
      content: entryContent,
      sidebar: {
        list: sidebar[ja],
      },
      nav: nav,
      lang: lang,
      app: appConfig.app,
      level: '../',
      ext: ext,
    })
  }

  /** Output sitemap to dist root */
  buildSitemap = (paths: AppPaths, data: { [key: string]: any }[]): void => {
    // Create a stream to write to
    const stream = new SitemapStream({ hostname: 'https://www.tmdict.com' })
    // Loop over your links and add them to your stream
    data.forEach((sm) => stream.write(sm))
    // End the stream
    stream.end()
    // Return a promise that resolves with your XML string
    streamToPromise(stream).then((data) => {
      // Write sitemap to file
      outputFile(data.toString(), `${paths.dist}/sitemap.xml`)
    })
  }
}

export const builder = new Builder()
