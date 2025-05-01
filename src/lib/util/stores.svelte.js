import { browser } from '$app/environment';

// Site states
let _theme = $state("chaldea");
let _showfilter = $state(true);

if (browser && localStorage.getItem('tmdict.theme')) {
  try {
    const localTheme = JSON.parse(localStorage.getItem('tmdict.theme'));
    _theme = ["chaldea", "shadowborder"].includes(localTheme) ? localTheme : "chaldea";
    const localShowfilter = JSON.parse(localStorage.getItem('tmdict.showfilter'));
    _showfilter = localShowfilter ?? true;
  } catch (err) {
    console.log(`Error parsing localStorage data: ${err}`);
  }
}

export const store = {
  // Theme
  get theme() { return _theme; },
  set theme(input) {
    _theme = input;
    browser && localStorage.setItem('tmdict.theme', JSON.stringify(_theme));
  },
  // Show Filter
  get showfilter() { return _showfilter; },
  set showfilter(input) {
    _showfilter = input;
    browser && localStorage.setItem('tmdict.showfilter', JSON.stringify(_showfilter));
  },
};

// Book states
export const bookstore = $state({ lang: "en" });
