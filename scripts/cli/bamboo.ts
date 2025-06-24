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
    // Load pages and sidebar data
    const pageData = parser.parseEntry("page", "page", attrData, contentData);
    const sideData = pageData.content
    .filter(page => ["top", "contribute"].includes(page.id))
    .reduce((acc: any, page) => {
      Object.keys(page.i18n).forEach(lang => {
        acc[lang] = acc[lang] || {};
        acc[lang][page.id] = page.i18n[lang].html;
      });
      return acc;
    }, {});
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
        // Generate meta description
        const cleaned = entryContent[0].html.replace(/(?:<[^>]*>|\n)+/g, " ").substring(1, 160);
        const metaDescription = cleaned.substring(0, cleaned.lastIndexOf(" "));
        toTemplate(templates["page.html"], `static/legacy/${entryPath}.html`, {
          isEntry: true,
          id: `${ja}.${entryData.attribute.id}`,
          app: appConfig.app,
          lang: lang,
          nav: nav,
          metaDescription: metaDescription,
          attribute: {
            id: entryData.attribute.id,
            name: entryData.attribute.attr.name[lang],
            alphabet: { id: en, name: attrData.alphabet[en].data.name[lang] },
            hiragana: { id: ja, name: attrData.hiragana[ja].data.name[lang] },
            hiraganaRow: { id: jaRow, name: attrData["hiragana-row"][jaRow].data.name[lang] },
          },
          content: entryContent,
          sidebar: {
            fname: attrData["hiragana"][ja].data.name[lang],
            lname: "",
            content: sideData[lang],
          },
          back: `/${lang}/${ja}.${entryData.attribute.id}`,
        });
      });
      // Add parsed data to filterlist data and i18n collection
      const entryAttrFilterlist = parser.parseAttributeFilterlist(entryId, entryData, attrData, filters);
      // Append Work attr
      filterlist.push(
        { ...entryAttrFilterlist, ...{ 
          work: entryAttrFilterlist["source"]
            .map((src: string) => attrData["source"][src].attribute["work"])
            .filter((val: string, i: number, arr: string[]) => arr.indexOf(val) == i) // Dedupe
        }}
      );
      // Prep i18n data for filterlist
      const entryi18n = parser.parseFilterlistI18n(entryId, entryData, attrData, filters);
      Object.keys(entryi18n).forEach(attrType => {
        // Append merge each i18n attr entry for that attr into the attr's i18n collection
        i18n[attrType] = { ...i18n[attrType], ...entryi18n[attrType] };
      });
    });
    // Append work i18n data
    i18n["work"] = {};
    Object.keys(attrData["work"]).forEach((work: string) => {
      i18n["work"][work] = attrData["work"][work].data.name;
    });
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
            content: sideData[lang],
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
