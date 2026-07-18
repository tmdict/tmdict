import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Pinned so builds are reproducible: the default (Date.now()) is baked
    // into a client chunk and every prerendered page, rewriting the whole
    // site each build. A constant is safe while nothing uses version-based
    // update detection (updated store, pollInterval, service worker).
    version: { name: '1' },
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    })
  }
};

export default config;
