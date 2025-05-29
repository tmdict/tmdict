import _ from "lodash";
import { bamboo } from "./bamboo.js";
import { builder } from "./builder.js";
import { loader } from "./loader.js";
import { parser } from "./parser.js";
import { AttributeData, EntryContent, EntryData } from "./types.js";

console.log("\nBuilding: tmdict");

// Load attributes and content
const appConfig = loader.loadConfig();
const attrData: AttributeData = loader.loadAttrData(appConfig.paths);
const contentData: any = loader.loadContentData(appConfig.paths);

// Sitemap
const sitemap: { [key: string]: any }[] = [];
sitemap.push({changefreq: 'monthly', priority: 1.0, url: `https://www.tmdict.com/book`});
["en", "ja", "zh"].forEach(lang => {
  sitemap.push({changefreq: 'monthly', priority: 1.0, url: `https://www.tmdict.com/${lang}/`});
  sitemap.push({changefreq: 'monthly', priority: 1.0, url: `https://www.tmdict.com/${lang}/about`});
  sitemap.push({changefreq: 'monthly', priority: 1.0, url: `https://www.tmdict.com/${lang}/site`});
  sitemap.push({changefreq: 'monthly', priority: 1.0, url: `https://www.tmdict.com/${lang}/misc`});
  sitemap.push({changefreq: 'monthly', priority: 1.0, url: `https://www.tmdict.com/${lang}/glossary`});
  sitemap.push({changefreq: 'monthly', priority: 1.0, url: `https://www.tmdict.com/${lang}/profile/`});
});

// Search
const searchData: { [key: string]: any }[] = [];

// Build assets, img, css, etc.
console.log("Building assets...");
builder.buildImg(appConfig.paths);
builder.buildCss(appConfig.paths);

// Output JS consts used by the App
console.log("Building consts...");
builder.toJsonExport("src/lib/__generated/constants.json", appConfig.app);

// Build site page data
console.log("Building pages...");
const pageData = parser.parseEntry("page", "page", attrData, contentData).content
  .reduce((acc, page) => {
    return _.merge(acc, {
      [page.id]: {
        id: page.id,
        i18n: page.i18n
      }
    })
  }, {});
builder.toJsonExport("src/lib/__generated/pages.json", pageData);

const staticEntryPaths: { [key: string]: any } = {};
const bookData: { [key: string]: any } = {};
// Build metadata and content for each content type (profile and glossary)
Object.keys(appConfig.content).forEach((contentType: string) => {
  console.log(`Building ${contentType} data...`);
  
  // Build entries
  let count = 0;
  staticEntryPaths[contentType] = [];
  // Parse each attribute in an attribute type
  const parsedData = Object.keys(attrData[contentType]).reduce(
    (acc, entryId: string) => {
      const entryDataRaw: EntryData = parser.parseEntry(entryId, contentType, attrData, contentData);
      const entryData: EntryData = parser.filterContentBySource(entryDataRaw, appConfig.sources.site);

      // Generates JSON data  to be consumed by the js app
      const entryPath = `${entryData.attribute.type}/entries/${entryData.attribute.id}`;
      builder.toJsonExport(`src/lib/__generated/data/${entryPath}.json`, entryData);

      ["en", "ja", "zh"].forEach(lang => {
        const path = (contentType === "profile") ? entryData.attribute.id : `${entryData.attribute.ja}.${entryData.attribute.id}`;
        staticEntryPaths[contentType].push({
          lang: lang,
          [contentType]: path
        });

        sitemap.push({
          changefreq: 'monthly',
          priority: 1.0,
          url: `https://www.tmdict.com/${lang}/${(contentType === "profile") ? "profile/" : ""}${path}`,
        });

        // Aggregate search data
        const searchContent = entryData.content
          .map((c: EntryContent) => (c.i18n[lang] ? c.i18n[lang].html : ''))
          .join(' ');
        searchData.push({
          title: entryData.attribute.attr.name[lang],
          url: `https://www.tmdict.com/${lang}/${(contentType === "profile") ? "profile/" : ""}${path}`,
          lang: lang,
          type: contentType,
          text: parser
            .parseSearchMarkup(searchContent)
            .replace(/\\|<em>|<\/em>|<strong>|<\/strong>|\\n/g, '')
            .replace(/<[^>]*>/g, ' '),
        })
      });
      count++;

      // Add parsed data to filterlist data and i18n collection
      const entryAttrFilterlist = parser.parseAttributeFilterlist(
        entryId,
        entryData,
        attrData,
        appConfig.content[contentType]
      );

      // Append Work attr to filterlist data object
      const workAttr = entryAttrFilterlist["source"]
        .map((src: string) => attrData["source"][src].attribute["work"])
        .filter((val: string, i: number, arr: string[]) => arr.indexOf(val) == i); // Dedupe
      const entryFilterlist = _.merge(entryAttrFilterlist, { work: workAttr });

      // Prep i18n data for filterlist attributes
      const entryAttrI18n = parser.parseFilterlistI18n(entryId, entryData, attrData, appConfig.content[contentType]);

      if (contentType === "glossary") {
        // Add category to filterlist
        entryFilterlist["category"] = entryData.content.reduce((acc, item) => {
          return [...new Set([...acc, ...item.category])];
        }, []);
        // If glossary, include entry content for filter list
        entryFilterlist["content"] = entryData.content.map((entry: EntryContent) => {
          return ["en", "ja", "zh"].reduce((acc, lang) => {
            return _.merge(acc, {
              [lang]: {
                id: entry.i18n[lang] ? attrData["content-id"][entry.id].data.name[lang] : "", // Get content-id name
                source: entry.i18n[lang] ? attrData["source"][entry.source].data.name[lang] : "", // Get source name
                html: entry.i18n[lang] ? parser.parseSearchMarkup(entry.i18n[lang].html) : "",
              },
            });
          }, {});
        });

        // Filter for only specific glossary books
        entryData.content.forEach((entry: EntryContent) => {
          if (appConfig.sources.book.includes(entry.source)) {
            // If key for current source doesn"t exist, add it
            if (!(entry.source in bookData)) {
              bookData[entry.source] = {
                glossary: attrData["content-id"][entry.id],
                source: attrData.source[entry.source],
                entries: [],
              };
            }
            bookData[entry.source].entries.push(
              _.merge(entry, { name: attrData.glossary[entry.parent].data.name })
            );
          }
        });
      }

      // Merge parsed entry filterlist data and i18n data into accumulator
      return {
        entries: _.merge(acc.entries, { [entryId]: entryData }),
        filterlist: acc.filterlist.concat(entryFilterlist),
        i18n: _.merge(acc.i18n, entryAttrI18n),
      };
    },
    {
      entries: {},
      filterlist: [], // Initial filterlist content array
      i18n: {}, // Initial filterlist i18n attribute map
    }
  );
  console.log(`...Parsed ${count} ${contentType} data`);

  // Append work i18n data
  parsedData.i18n["work"] = {};
  Object.keys(attrData["work"]).forEach((work) => {
    parsedData.i18n["work"][work] = attrData["work"][work].data.name;
  });

  // Append category i18n data
  parsedData.i18n["category"] = {};
  Object.keys(attrData["category"]).forEach((category) => {
    parsedData.i18n["category"][category] = attrData["category"][category].data.name;
  });

  // Build filterlist js
  builder.toJsonExport(`src/lib/__generated/data/${contentType}/filterlist.json`, {
    attribute: appConfig.content[contentType],
    content: parsedData.filterlist,
    i18n: parsedData.i18n,
  });

  // Build search js
  builder.toJsonExport(`src/lib/__generated/data/search.json`, searchData, true);

  // Build entries js
  //builder.toJsonExport(`src/lib/__generated/data/${contentType}/entries.json`, parsedData.entries);
});

// Build paths js for static pages
builder.toJsonExport("src/lib/__generated/entrypaths.json", staticEntryPaths);

// Build book js
console.log("Building book...");
Object.keys(bookData).forEach((id: string) => {
  // Sort entries in each book
  bookData[id].entries.sort((a: EntryContent, b: EntryContent) => a.weight - b.weight);
});
builder.toJsonExport("src/lib/__generated/data/book.json", Object.keys(bookData)
  .map((id) => bookData[id])
  .sort((a: any, b: any) => {
    return a.source.weight - b.source.weight;
  })
);

// Build sitemap
builder.buildSitemap("https://www.tmdict.com", sitemap);

// Build old tmdict
console.log("Building old tmdict...");
bamboo.buildTmdict(appConfig, attrData, contentData);

console.log("Build complete!!!");
