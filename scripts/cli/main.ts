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

const bookData: { [key: string]: any } = {};
// Build metadata and content for each content type (profile and glossary)
Object.keys(appConfig.content).forEach((contentType: string) => {
  console.log(`Building ${contentType} data...`);
  
  // Build entries
  let count = 0;
  // Parse each attribute in an attribute type
  const parsedData = Object.keys(attrData[contentType]).reduce(
    (acc, entryId: string) => {
      const entryDataRaw: EntryData = parser.parseEntry(entryId, contentType, attrData, contentData);
      const entryData: EntryData = parser.filterContentBySource(entryDataRaw, appConfig.sources.site);

      // Generates JSON data  to be consumed by the js app
      const entryPath = `${entryData.attribute.type}/entries/${entryData.attribute.id}`;
      builder.toJsonExport(`src/lib/__generated/data/${entryPath}.json`, entryData);
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
          return _.union(acc, item.category);
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

  // Build entries js
  //builder.toJsonExport(`src/lib/__generated/data/${contentType}/entries.json`, parsedData.entries);
  //console.log(`Build ${contentType} entries complete!!!`);
});

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

// Build old tmdict
console.log("Building old tmdict...");
bamboo.buildTmdict(appConfig, attrData, contentData);

console.log("Build complete!!!");
