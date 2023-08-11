import * as _ from 'lodash';
import * as fs from 'fs-extra';
import { marked } from 'marked';
import * as matter from 'gray-matter';
import * as path from 'path';

import { AppPaths } from './types';

/** Reads and parses a JSON file */
function loadJson(p: string): any {
  const f: string = fs.readFileSync(p, 'utf8');
  return JSON.parse(f);
}

/** Reads and parses a MD file with front matter, returns as a JSON object */
function loadMarkdown(p: string): any {
  const f: string = fs.readFileSync(p, 'utf8');
  const data = matter(f);
  // Set Markdown options
  marked.setOptions({ breaks: true });
  return { ...data, html: marked(data.content) };
}

/** Lodash customizer for merging arrays */
function arrayCustomizer(objValue: any, srcValue: any): any[] {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/**
 * Converts an array of objects into a object of objects, keyed by the `key`
 * field of each array element, by default uses the `id` key
 */
function arrayToObject(arr: any[], key = 'id'): any {
  return arr.reduce((obj: any, item: any) => {
    obj[item[key]] = item;
    return obj;
  }, {});
}

/**
 * Goes through the given folder and recursively traverses its subdirs, load files
 * encountered using the `loader` callback, and aggregate the file content to an
 * object, where each file object is in an array under a `key` specified in the loader
 *
 * @param currentPath Current full path relative to recursion level
 * @param loader Function used to process files
 * @param data Object to hold all files loaded so far
 */
function walkDir(currentPath: string, loader: (path: string, file: string) => any, data: any = {}): any {
  return (
    fs
      .readdirSync(currentPath)
      // Filter out system files: https://stackoverflow.com/a/37030655
      .filter((result) => !/(^|\/)\.[^/.]/g.test(result))
      .reduce((acc, f) => {
        const subDirPath = path.join(currentPath, f);
        if (fs.statSync(subDirPath).isDirectory()) {
          // Recursively process dir/files in that directory
          return _.mergeWith(acc, walkDir(subDirPath, loader), arrayCustomizer);
        } else {
          // If just a file, load the file using given loader
          const result = loader(subDirPath, f);
          // If file is eligible for the loader, add it to collection [] under [key]
          return result.valid ? _.mergeWith(acc, { [result.key]: [result.data] }, arrayCustomizer) : acc;
        }
      }, data)
  );
}

/**
 * Load all attribute data, returns loaded content in the following format:
 * {
 *   [attrType1]: [
 *     { id: ..., type: ..., ... },
 *     { <content of each attr JSON file> },
 *   ],
 *   [attrType2]: [
 *     { id: ..., type: ..., ... },
 *     { <content of each attr JSON file> },
 *   ],
 *   ...
 * }
 */
function attrLoader(path: string, file: string): any {
  // All JSON files that do not start with `.`
  if (!file.startsWith('.') && file.endsWith('.json')) {
    // Remove extension from file name to get id
    const id: string = file.replace(/\.json$/, '');
    const json = _.merge({ id: id }, loadJson(path));
    // If name doesn't have i18n, use name value for all i18n
    if (json.data.name.en === undefined) {
      json.data.name = {
        en: json.data.name,
        ja: json.data.name,
        zh: json.data.name,
      };
    }
    return { valid: true, key: json.type, data: json };
  } else {
    return { valid: false };
  }
}

/**
 * Load all content/translation data, returns loaded content in the following format:
 * {
 *   // Each element in the array corresponds to a MD file
 *   // [key] is based on a file's parent
 *   [key1]: [
 *     {
 *       content: ..., // Markdown content
 *       data: { // Frontmatter content },
 *       html: ... // Parsed MD,
 *       ...
 *     },
 *     { ... },
 *   ],
 *   [key2]: [ ... ],
 * }
 */
function contentLoader(path: string, file: string): any {
  // MD files are collection of contents
  if (!file.startsWith('.') && !file.startsWith('__') && file.endsWith('.md')) {
    const md = loadMarkdown(path);
    return { valid: true, key: md.data.parent, data: md };
  }
  return { valid: false };
}

/**
 * Load all handlebars template file
 */
function templateLoader(path: string, file: string): any {
  // MD files are collection of contents
  if (!file.startsWith('.') && file.endsWith('.hbs')) {
    // Remove extension from file name to get id
    const id: string = file.replace(/\.hbs$/, '');
    const template: string = fs.readFileSync(path, 'utf8');
    return { valid: true, key: id, data: template };
  }
  return { valid: false };
}

export default class Loader {
  /** Given an app name, load config for that app/site for processing */
  loadConfig = (app: string): any => {
    console.log(`Loading app config: ${app}`);
    return loadJson(`./src/app/${app}/config.json`);
  };
  /** Load all templates and key them by filename */
  loadTemplate = (app: string): any => {
    console.log('Loading templates');
    const raw: any = walkDir(`./src/app/${app}/template`, templateLoader);
    const parsed = {};
    // Convert array of templates into key-values maps
    for (const key of Object.keys(raw)) {
      // There's only 1 template per key
      _.merge(parsed, { [key]: raw[key][0] });
    }
    return parsed;
  };
  /** Load all attribute data */
  loadAttrData = (paths: AppPaths): any => {
    console.log('Loading attr data');
    const rawAttrData: any = walkDir(`${paths.data}/attribute`, attrLoader);
    const parsedAttrData = {};
    // Convert array of attributes into key-values attribute maps
    // {attr: [ { ... }, { ... }, ]} --> {attr: { id: {...}, id: {...}, }}
    for (const attr of Object.keys(rawAttrData)) {
      _.merge(parsedAttrData, { [attr]: arrayToObject(rawAttrData[attr]) });
    }
    return parsedAttrData;
  };

  /** Load all contents */
  loadContentData = (paths: AppPaths, contentPath = ''): any => {
    console.log('Loading content data');
    return walkDir(`${paths.data}/content${contentPath}`, contentLoader);
  };
}

export const loader = new Loader();
