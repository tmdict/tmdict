import _ from "lodash";

import {
  Attribute,
  AttributeData,
  EntryContent,
  EntryData,
  EntryMetadata,
  Filter,
  LayoutAttribute,
  PreparedAttribute,
} from "./types.js";

/** Converts custom content markup into HTML */
function parseContentMarkup(html: string, lang: string, id = ""): string {
  const tlnotes: { [key: string]: string } = {
    en: "Translator’s Notes",
    ja: "翻訳者注",
    zh: "译者注",
  };
  return (
    html
      // Missing content
      .replace(
        /{{missing}}/g,
        `<span id="contact" class="contact"><a href="/contact/">!missing・contribute</a></span>`
      )
      // TL notes
      .replace(/{{notes}}/g, tlnotes[lang])
      // Black diamond breaks found in material books
      .replace(/&lt;&gt;/g, `<div style="text-align:center">◆</div>`)
      // Inline translation notes
      .replace(
        // {{n[0-9]}}
        /{{n([0-9]+)}}/g,
        function (match: string, p1: string): string {
          return `<sup id="${id}.n${p1}" class="note"><a title="${match.replace(
            /[{|}]/g,
            ""
          )}" href="#${id}.note${p1}">${p1}</a></sup>`;
        }
      )
      // Full translation notes
      .replace(/{{note([0-9]+)}}/g, function (match: string, p1: string): string {
        return `<a id="${id}.note${p1}" class="notelink" title="${match.replace(/[{|}]/g, "")}" href="#${id}.n${p1}">^</a>`;
      })
      // Ruby text: [text]{ruby-text}
      .replace(/\[([^)\]]*)\]{([^)\]]*)}/g, function (_match: string, p1: string, p2: string): string {
        return `<ruby>${p1}<rp>(</rp><rt>${p2}</rt><rp>)</rp></ruby>`;
      })
  );
}

/**
 * Flattens a Attribute's `data {...}` into { type: ..., <key>: ..., en: <name>, ja: <name>, zh: <name> }
 * and append links to attributes that have their own page
 */
function flattenAttributeData(attr: any): PreparedAttribute {
  let attrName: { [key: string]: string } = {};
  try {
    // If attr type is `profile` or `glossary`, append make it linkable
    if (["profile", "glossary"].includes(attr.type)) {
      Object.keys(attr.data.name).forEach((lang: string) => {
        const link = (attr.type === "profile") ? `<a href="/${lang}/${attr.type}/${attr.id}">${attr.data.name[lang]}</a>` : `<a href="/${lang}/${attr.id}">${attr.data.name[lang]}</a>`;
        attrName = _.merge(attrName, { [lang]: link });
      });
    } else {
      attrName = attr.data.name;
    }
  } catch (err) {
    console.log(`[ERROR flattenAttributeData] [${attr.id}]: ${err}`);
  }
  // Flatten the attributes for easier keying for rendering
  return _.merge({ id: attr.id, type: attr.type }, attrName);
}

/**
 * Given an entry id and raw attributes, converts raw attribute JSON into app
 * data, returns a flattened object that looks like:
 *
 * {
 *  [commonAttr1]: [ { id:"", type:"", en:"", ja:"", zh:""} ]
 *  [commonAttr2]: [ { id:"", type:"", en:"", ja:"", zh:""} ]
 *  [dataAttr1]: { en:"", ja:"", zh:"" }
 *  [dataAttr2]: { en:"", ja:"", zh:"" }
 * }
 */
function parseAttribute(entryAttr: Attribute, attrData: AttributeData): object {
  let parsedAttr: any = entryAttr.data;

  if (entryAttr.attribute) {
    for (const attribute of Object.keys(entryAttr.attribute)) {
      try {
        // If attr is of form `a.b` where `a` is the label and `b` is the actual
        // attribute, retrieve attr value with `b` while using `a.b` for i18n label
        const attr: string = attribute.split(".").length > 1 ? attribute.split(".")[1] : attribute;

        // Convert them to arrays for multi-attrLayout support
        const currentAttr: string | string[] = entryAttr.attribute[attribute];
        const data = Array.isArray(currentAttr)
          ? (currentAttr as string[]).map((a: string) => flattenAttributeData(attrData[attr][a]))
          : [flattenAttributeData(attrData[attr][currentAttr])];

        parsedAttr = _.merge(parsedAttr, { [attribute]: data });
      } catch (err) {
        console.log(`[ERROR parseAttribute] [${entryAttr.id}/${attribute}/${entryAttr.attribute[attribute]}]: ${err}`);
      }
    }
  }
  return parsedAttr;
}

/**
 * Given an attribute layout and attributes, map the attributes to the layout
 *
 * {
 *   en: [
 *     [attr1]: [<string>],
 *     [attr2]: [<string>],
 *   ],
 *   ja: [...],
 *   zh: [...],
 * }
 */
function mapAttrToLayout(layout: string[][], parsedAttr: any): LayoutAttribute {
  try {
    return Object.keys(parsedAttr.name).reduce((acc, lang) => {
      // Go through each attr section
      const result = layout.map((section: string[]) => {
        // Map collection of keys to the parsed data
        return section.reduce((a, key) => {
          // Populate content for each attr section
          const attrContent = Array.isArray(parsedAttr[key])
            ? // Attributes with array of values
              (parsedAttr[key] as string[]).map((e: any) => e[lang])
            : // Attribute with a single value
              [parsedAttr[key][lang]];
          return _.merge(a, { [key]: attrContent });
        }, {});
      });
      return _.merge(acc, { [lang]: result });
    }, {});
  } catch (err) {
    console.log(`[ERROR mapAttrToLayout] [${parsedAttr.id} (${parsedAttr.name.en})]: ${err}`);
  }
}

/** Converts raw attribute JSON into app data */
function parseMetadata(entryAttr: Attribute, parsedAttr: any, layout: LayoutAttribute): EntryMetadata {
  return {
    id: entryAttr.id,
    type: entryAttr.type,
    attr: parsedAttr,
    layout: layout,
    uid: entryAttr.uid ? entryAttr.uid : "-",
    // https://stackoverflow.com/a/50367186 and https://stackoverflow.com/a/40560953
    ...(entryAttr.attribute.alphabet && { en: entryAttr.attribute.alphabet as string }),
    ...(entryAttr.attribute.hiragana && { ja: entryAttr.attribute.hiragana as string }),
    ...(entryAttr.attribute["hiragana-row"] && { jaRow: entryAttr.attribute["hiragana-row"] as string }),
    ...(entryAttr.img && { img: entryAttr.img }),
    ...(entryAttr.releaseDate && { releaseDate: entryAttr.releaseDate }),
    ...(entryAttr.page && { page: entryAttr.page }),
  };
}

/** Converts raw content JSON into entry page data */
function parseContent(id: string, contentData: any, attrData: AttributeData): EntryContent[] {
  const parsedContent: { [key: string]: EntryContent } = {};
  // Go through each content and group them by id and language
  contentData.forEach((c: any) => {
    try {
      // Temp key to group contents of different language by source.id
      const sourceSectionKey = `${c.data.source}.${c.data.id}`;
      // Current lang
      const lang = c.data.language;
      // Parse custom {{}} markup
      const parsedHtml: string = parseContentMarkup(c.html, lang, sourceSectionKey);
      // Replace optional member with "" if not present
      const sourceId = "source" in c.data ? c.data.source : "";
      const sourceLang = "source" in c.data ? attrData["source"][sourceId]["data"]["name"][lang] : "";
      const translation = "translation" in c.data ? c.data.translation : "";
      const img = "img" in c.data ? c.data.img : "";
      const profile = "profile" in c.data ? 0 : 1; // Used to sort profile content
      // Use common attr ID for name, if not use "name" override, else ""
      const name =
        "name" in c.data
          ? c.data.name
          : c.data.id in attrData["content-id"]
          ? attrData["content-id"][c.data.id]["data"]["name"][c.data.language]
          : "";
      // Use common attr ID for category
      const category = "category" in c.data ? c.data.category : [];
      const categoryi18n =
        "category" in c.data
          ? c.data.category.map((cat: string) => {
              return {
                id: cat,
                name: attrData["category"][cat]["data"]["name"][c.data.language],
              };
            })
          : [];
      // Instantiate content data if there is no content under current source.id key
      if (!_.has(parsedContent, sourceSectionKey)) {
        parsedContent[sourceSectionKey] = {
          parent: c.data.parent,
          source: sourceId, // Optional
          id: c.data.id,
          weight: c.data.weight,
          img: img, // Optional
          profile: profile, // For prioritizing profile content
          category: category, // Optional
          i18n: {},
        };
      }
      // Add new content under its language
      parsedContent[sourceSectionKey].i18n[c.data.language] = {
        name: {
          // Optional
          id: c.data.id,
          name: name,
        },
        source: {
          // Optional
          id: sourceId,
          name: sourceLang,
        },
        img: img, // Optional
        translation: translation, // Optional
        category: categoryi18n, // Optional
        html: parsedHtml,
      };
    } catch (err) {
      console.log(`[ERROR parseContent] [${id}/${c.data.source}/${c.data.id}]: ${err}`);
    }
  });

  // Convert parsed content data into array of content data
  return Object.keys(parsedContent).map((key: string) => parsedContent[key]);
}

export default class Parser {
  /**  Generates site data given entry files, some content types may not have translations */
  parseEntry = (
    entryId: string,
    entryType: string,
    attrData: AttributeData,
    contentData: any = {}
  ): EntryData => {
    try {
      // Convert raw attribute data into attr object keyed by attr name
      const entryAttr: Attribute = attrData[entryType][entryId];
      const parsedAttr: any = parseAttribute(entryAttr, attrData);
      // Packing it all together into a layout if there is one
      const layout: LayoutAttribute = "layout" in entryAttr ? mapAttrToLayout(entryAttr.layout, parsedAttr) : {};
      // Convert attribute into site metadata
      const metadata: EntryMetadata = parseMetadata(entryAttr, parsedAttr, layout);
      // Generate content then sort by their weight
      const content: EntryContent[] =
        entryId in contentData && contentData[entryId].length
          ? parseContent(entryId, contentData[entryId], attrData).sort((a, b) => {
              // Sort content by type (profile vs glossary), then source weight, then content weight
              const aSource: number = attrData.source[a.source] ? attrData.source[a.source].weight : 0;
              const bSource: number = attrData.source[b.source] ? attrData.source[b.source].weight : 0;
              return a.profile - b.profile || aSource - bSource || a.weight - b.weight;
            })
          : [];
      return {
        entryType: entryType, // Type of entry
        attribute: metadata, // Attributes are converted to site metadata
        content: content, // Content translations are converted to site content
      };
    } catch (err) {
      console.log(`[ERROR parseEntry] [${entryId}]: ${err}`);
    }
  };

  /** Parse raw attribute data into filterlist data for the given attribute type */
  parseAttributeFilterlist = (
    entryId: string,
    entryData: EntryData,
    attrData: AttributeData,
    filterlist: Filter
  ): { [key: string]: any } => {
    try {
      const entry: Attribute = attrData[filterlist.type][entryId];
      const attributes: any = {};
      // Extract filterable attributes from Entry
      for (const attr of filterlist.filter) {
        // Get array of filterable attributes
        if (entry.attribute && entry.attribute[attr]) {
          const filterArr = Array.isArray(entry.attribute[attr])
            ? (entry.attribute[attr] as string[])
            : [entry.attribute[attr] as string];
          attributes[attr] = filterArr;
        } else {
          // Extract filterable attributes from content if it exists
          if (filterlist.contentFilter && filterlist.contentFilter.includes(attr)) {
            const contentFilters = entryData.content.reduce((acc: string[], content: any) => {
              if (content[attr]) {
                const contentFilterKeys = Array.isArray(content[attr])
                  ? (content[attr] as string[])
                  : [content[attr] as string];
                return acc.concat(contentFilterKeys);
              }
            }, []);
            // Dedupe and add content filters to collection
            attributes[attr] = [...new Set(contentFilters)];
          }
        }
      }
      // Return extracted attributes and other necessary data (id, etc.) for filterlist
      return _.merge(attributes, {
        id: entry.id,
        name: entry.data.name,
        uid: entry.uid ? entry.uid : "-",
        ...(entry.attribute.alphabet && { en: entry.attribute.alphabet as string }),
        ...(entry.attribute.hiragana && { ja: entry.attribute.hiragana as string }),
        ...(entry.attribute["hiragana-row"] && { jaRow: entry.attribute["hiragana-row"] as string }),
      });
    } catch (err) {
      console.log(`[ERROR parseAttributeFilterlist] [${entryId}]: ${err}`);
    }
  };

  /** Generate an i18n map for all filterlist filters that appears for this entry, a map of attrType->attrName->i18n */
  parseFilterlistI18n = (entryId: string, entryData: EntryData, attrData: AttributeData, filterlist: Filter): any => {
    try {
      const entry: Attribute = attrData[filterlist.type][entryId];
      const i18n: { [key: string]: { [key: string]: { [key: string]: string } } } = {};
      for (const attr of filterlist.filter) {
        // Get array of filterable attributes
        if (entry.attribute && entry.attribute[attr]) {
          const filterArr = Array.isArray(entry.attribute[attr])
            ? (entry.attribute[attr] as string[])
            : [entry.attribute[attr] as string];
          filterArr.forEach((f) => {
            if (!_.has(i18n, attr)) i18n[attr] = {}; // Instantiate new attr type key in i18n
            i18n[attr][f] = attrData[attr][f].data.name;
          });
        } else {
          // Extract filterable attributes from content
          if (filterlist.contentFilter && filterlist.contentFilter.includes(attr)) {
            const contentFilters = entryData.content.reduce((acc: string[], content: any) => {
              if (content[attr]) {
                const contentFilterKeys = Array.isArray(content[attr])
                  ? (content[attr] as string[])
                  : [content[attr] as string];
                return acc.concat(contentFilterKeys);
              }
            }, []);
            // Dedupe and add content filters to collection
            contentFilters
              .filter((val, i) => contentFilters.indexOf(val) == i) // Dedupe
              .forEach((f) => {
                if (!_.has(i18n, attr)) i18n[attr] = {}; // Instantiate new attr type key in i18n
                i18n[attr][f] = attrData[attr][f].data.name;
              });
          }
        }
      }
      // Return extracted attributes and other necessary data (id, etc.) for filterlist
      return i18n;
    } catch (err) {
      console.log(`[ERROR parseFilterlistI18n] [${entryId}]: ${err}`);
    }
  };

  /** Strip HTML tags from search data */
  parseSearchMarkup = (html: string): string => {
    return html
      .replace(/<h3 id="(.*)">/g, "<h3>")
      .replace(/<h5 id="notes">(.*)<\/h5>/g, "")
      .replace(/<a id="[a-z0-9-_.]+" class="notelink" title="[a-z0-9-_.]+" href="#[a-z0-9-_.]+">\^<\/a>/g, "")
      .replace(
        /<sup id="[a-z0-9-_.]+" class="note"><a title="[a-z0-9-_.]+" href="#[a-z0-9-_.]+">[0-9]+<\/a><\/sup>/g,
        ""
      );
  };

  /** Filter an EntryData's content given a whitelist of sources */
  filterContentBySource = (entryData: EntryData, sourceFilter: string[]): EntryData => {
    const filteredContent = entryData.content.filter((entryContent: EntryContent) =>
      sourceFilter.includes(entryContent.source)
    );
    return {
      entryType: entryData.entryType,
      attribute: entryData.attribute,
      content: filteredContent,
    };
  };
}

export const parser = new Parser();
