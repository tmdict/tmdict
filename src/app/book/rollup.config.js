import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';
import { spawn } from 'child_process';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import fs from 'fs-extra'
import livereload from 'rollup-plugin-livereload';
import path from 'node:path';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;
const appConfig = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));

export default {
  input: Object.fromEntries(
    globSync(`${__dirname}/__tmp/js/**/*.js`).map(file => [
      // This removes `src/` as well as the file extension from each
      // file, so e.g. src/nested/foo.js becomes nested/foo
      path.relative(
        `${appConfig.paths.src}/__tmp/`,
        file.slice(0, file.length - path.extname(file).length)
      ),
      // This expands the relative paths to absolute paths, so e.g.
      // src/nested/foo becomes /project/src/nested/foo.js
      fileURLToPath(new URL(file, import.meta.url))
    ])
  ),
  output: {
    sourcemap: true,
    format: 'es',
    dir: `${appConfig.paths.dist}/src`,
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('dist'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}
