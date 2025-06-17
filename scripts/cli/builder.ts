import cssnano from "cssnano";
import crypto from "crypto";
import fs from "fs-extra";
import postcss from "postcss";
import atImport from "postcss-import";
import sharp from "sharp";
import { SitemapStream, streamToPromise } from "sitemap";

import { AppPaths } from "./types.js";

/**
 * @param content Content to be written to output file
 * @param path Directory + filename of output file
 */
function outputFile(content: string, path: string): void {
  fs.outputFile(path, content, (err: Error) => {
    if (err) {
      return console.log(err);
    }
  });
}

/** Converts PNG to JPG and AVIF */
function optimizeImg(dir: string, output: string): void {
  fs.readdir(dir, (err, files) => {
    if (err) console.log(`[ ERROR fs/sharp ] ${err}`);
    else {
      files = files.filter((item) => !/(^|\/)\.[^/.]/g.test(item));
      let count = 0;
      files.forEach((file) => {
        count += 1;
        const outfile = `${file.substring(0, file.lastIndexOf("."))}`;
        try {
          const outDir = [`${output}/jpg`, `${output}/avif`]
          outDir.forEach(dir => {
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
          })
          sharp(`${dir}/${file}`).clone().jpeg({ mozjpeg: true }).toFile(`${output}/jpg/${outfile}.jpg`);
          sharp(`${dir}/${file}`).clone().avif().toFile(`${output}/avif/${outfile}.avif`);
        } catch (err) {
          console.error(`[ ERROR sharp/${dir}/${file} ] ${err}`);
        }
      });
      console.log(`Optimized ${count} ${dir} images`);
    }
  });
}

export default class Builder {
  // Generate JSON data with `name` as key
  toJsonExport = (path: string, data: any, formatted = false): void => {
    try {
      outputFile(JSON.stringify(data, null, formatted ? 2 : null), path);
    } catch (err) {
      console.log(`[ERROR toJsonExport] [${path}]: ${err}`);
    }
  };

  // Synchronously copy static assets from `source` dir to `output` dir
  buildImg = (paths: AppPaths): void => {
    console.log(`Building assets`);
    optimizeImg(`${paths.data}/img/glossary`, "static/__generated/img/glossary");
    optimizeImg(`${paths.data}/img/profile/icon`, "static/__generated/img/profile/icon");
  };

  // Post-process CSS
  buildCss = (paths: AppPaths): void => {
    console.log(`Building css`);
    let hashes: { [key: string]: string } = {};
    try {
      paths.css.files.forEach((file) => {
        const css = fs.readFileSync(`scripts/css/${file}.css`, "utf8");
        const unixTs = Math.floor(Date.now() / 1000);
        const hash = crypto.createHash("md5").update(css).digest("hex");
        console.log(`css: ${file} - hash: ${unixTs}-${hash}`);
        hashes[file] = `${unixTs}-${hash}`;
        postcss()
          .use(atImport())
          .use(cssnano({ preset: ["default", { 
            discardComments: { removeAll: true } }],
          }))
          .process(css, {
            from: `scripts/css/${file}.css`
          })
          .then((output) => {
            outputFile(output.css, `static/__generated/css/${unixTs}-${hash}.css`);
          })
      });
      this.toJsonExport("src/lib/__generated/hashes.json", hashes);
    } catch (err) {
      console.log(`[ERROR css]: ${err}`);
    }
  };

  /** Output sitemap to dist root */
  buildSitemap = (hostname: string, data: { [key: string]: any }[]): void => {
    // Create a stream to write to
    const stream = new SitemapStream({ hostname: hostname });
    // Loop over your links and add them to your stream
    data.forEach((sm) => stream.write(sm));
    // End the stream
    stream.end();
    // Return a promise that resolves with your XML string
    streamToPromise(stream).then((data) => {
      // Write sitemap to file
      outputFile(data.toString(), "static/sitemap.xml");
    });
  };
}

export const builder = new Builder();
