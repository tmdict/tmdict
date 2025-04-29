import _ from "lodash";
import cssnano from "cssnano";
import fs from "fs-extra";
import handlebars from "handlebars";
import postcss from "postcss";
import atImport from "postcss-import";
import UglyJS from "uglify-js";
import { loader } from "./loader.js";
import { parser } from "./parser.js";
import { AppConfig, AttributeData, EntryData } from "./types.js";

const filters = {
  "type": "glossary",
  "name": {
    "en": "glossary",
    "ja": "glossary",
    "zh": "glossary"
  },
  "filter": ["alphabet", "hiragana", "hiragana-row", "source", "category"],
  "contentFilter": ["source", "category"]
}

const side: any = {
  "en": {
    "top": "<p>TMdict is a growing collection of glossaries from works by Type-Moon.</p><p>It presents the content in a light-weight, simple format that can be sorted and searched.</p>",
    "contribute": "<h2>Contribute</h2><p>Have a question? Find an error? Want to contribute? <a href=\"../../contact/\">Contact us</a>!</p>"
  },
  "ja": {
    "top": "<p>TMdict は、ゲーム、書籍、アニメなどTYPE-MOON の作品のボキャブラリーを収録していくプロジェクトです。</p><p>コンテンツは軽量かつシンプルなフォーマットで、用語の検索や並べ替えが可能です。</p>",
    "contribute": "<h2>お問合わせ</h2><p>ご質問やエラーのご連絡、またご協力については<a href=\"../../contact/\">お問い合わせください</a>。</p>"
  },
  "zh": {
    "top": "<p>型月辞典是一个在不断扩展的，以Type-Moon游戏，书，动漫等作品的词条为基础的网站。</p><p>本网站注重构造简单，方便快捷的模式，并提供一些简单的分类和搜索功能。</p>",
    "contribute": "<h2>应援</h2><p>有问题？碰到错误或不顺的地方了？想帮忙翻译或整理资源？请<a href=\"../../contact/\">联系我们</a>！</p>"
  }
}

/** Generates a file for the given template and data */
function toTemplate(template: string, path: string, data: any): void {
  try {
    handlebars.registerHelper("equals", (a, b) => {
      return a === b;
    });
    handlebars.registerHelper("json", (input) => {
      return JSON.stringify(input).replace(/\"/g, "'");
    });
    const output = handlebars.compile(template)(data);
    fs.outputFileSync(path, output);
  } catch (err) {
    console.log(`[ERROR toTemplate]: [${JSON.stringify(data)}]${err}`);
  }
}

export default class Bamboo {
  buildTmdict = (appConfig: AppConfig, attrData: AttributeData, contentData: any): void => {
    appConfig;
    contentData;
    const templates = loader.loadTemplate("scripts/legacy/template");
    // Top navbar data
    const nav = { 
      en: Object.keys(attrData["alphabet"])
      .map(id => ({ id: id, name: attrData["alphabet"][id].data.name.en }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      ja: Object.keys(attrData["hiragana-row"])
        .map(id => ({ id: id, name: attrData["hiragana-row"][id].data.name.ja }))
        .sort((a, b) => a.name.localeCompare(b.name))
    };
    let filterlist: any = []; // Initial filterlist content array
    let i18n: any = {}; // Initial filterlist i18n attribute map
    // Build Assets and CSS
    fs.copySync("scripts/legacy/asset", "static/legacy", { overwrite: true });
    fs.copySync("data/img/glossary", "static/legacy/src/img", { overwrite: true });
    postcss()
      .use(atImport())
      .use(cssnano({ preset: ["default", {  discardComments: { removeAll: true } }] }))
      .process(fs.readFileSync("scripts/legacy/css/bamboo.css", "utf8"), {
        from: "scripts/legacy/css/bamboo.css" 
      })
      .then((output) => {
        fs.outputFileSync("static/legacy/src/css/bamboo.css", output.css);
      });
      // Build Entries
    Object.keys(attrData.glossary).forEach((entryId: string) => {
      const entryDataRaw: EntryData = parser.parseEntry(entryId, "glossary", attrData, contentData);
      const entryData: EntryData = parser.filterContentBySource(entryDataRaw, appConfig.sources.book);
      // Generates HTML for Entries
      Object.keys(entryData.attribute.attr.name).forEach((lang: string) => {
        const en = entryData.attribute.en;
        const ja = entryData.attribute.ja;
        const jaRow = entryData.attribute.jaRow;
        const entryPath = `${lang}/${ja}.${entryData.attribute.id}`;
        // Get i18n content for each content[] for template
        const entryContent = entryData.content.map((c) => c.i18n[lang]);
        toTemplate(templates["page.html"], `static/legacy/${entryPath}.html`, {
          isEntry: true,
          id: `${ja}.${entryData.attribute.id}`,
          app: appConfig.app,
          lang: lang,
          nav: nav,
          attribute: {
            id: entryData.attribute.id,
            name: entryData.attribute.attr.name[lang],
            alphabet: { id: en, name: attrData.alphabet[en].data.name[lang]},
            hiragana: { id: ja, name: attrData.hiragana[ja].data.name[lang] },
            hiraganaRow: { id: jaRow, name: attrData["hiragana-row"][jaRow].data.name[lang] },
          },
          content: entryContent,
          sidebar: {
            fname: attrData["hiragana"][ja].data.name[lang],
            lname: "",
            content: side[lang],
          },
          back: `/${lang}/${ja}.${entryData.attribute.id}`,
        });
      });
      // Add parsed data to filterlist data and i18n collection
      const entryAttrFilterlist = parser.parseAttributeFilterlist(entryId, entryData, attrData, filters);
      // Append Work attr
      filterlist.push(
        _.merge(entryAttrFilterlist, { 
          work: entryAttrFilterlist["source"]
            .map((src: string) => attrData["source"][src].attribute["work"])
            .filter((val: string, i: number, arr: string[]) => arr.indexOf(val) == i) // Dedupe
        })
      );
      // Prep i18n data for filterlist
      i18n = _.merge(i18n, parser.parseFilterlistI18n(entryId, entryData, attrData, filters));
    });
    // Append work i18n data
    i18n["work"] = {};
    Object.keys(attrData["work"]).forEach((work: string) => {
      i18n["work"][work] = attrData["work"][work].data.name;
    });
    // Load pages data
    const pageData = parser.parseEntry("page", "page", attrData, contentData);
    Object.keys(appConfig.app.lang).forEach((lang) => {
      // Build pages
      pageData.content.forEach((page) => {
        toTemplate(templates["page.html"], `static/legacy/${lang}/${page.id}.html`, {
          isEntry: false,
          id: page.id,
          app: appConfig.app,
          lang: lang,
          nav: nav,
          attribute: {
            id: page.id,
            name: page.i18n[lang].name.name,
          },
          content: page.i18n[lang].html,
          sidebar: {
            fname: page.i18n.en.name.name[0],
            lname: page.i18n.en.name.name.substring(1),
            content: side[lang],
          },
          back: `/${lang}/${page.id}`,
        });
      });
      // Build filterlist js
      const fl = {
        filterlist: filterlist.map((entry: any) => ({
          ...entry,
          name: entry.name[lang],
        })),
        i18n: i18n,
      };
      fs.outputFileSync(`static/legacy/src/js/app.${lang}.js`, `const data = ${JSON.stringify(fl)};`);
      // Build filterlist app
      const appjs = fs.readFileSync("scripts/legacy/js/app.js", "utf8");
      fs.outputFileSync("static/legacy/src/js/app.js", UglyJS.minify(appjs).code);
      fs.copySync("scripts/legacy/js/mithril-2.2.15.min.js", "static/legacy/src/js/mithril-2.2.15.min.js", { overwrite: true });
      // Build filterlist page
      toTemplate(templates["app.html"], `static/legacy/${lang}/index.html`, {
        i18n: appConfig.app.i18n,
        lang: lang,
        nav: nav,
        back: `/${lang}/`,
      });
    });
  };
}

export const bamboo = new Bamboo();
