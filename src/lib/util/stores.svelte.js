import { browser } from '$app/environment';

// Site states
let _theme = $state("chaldea");

if (browser && localStorage.getItem('tmdict.theme')) {
  try {
    const local = JSON.parse(localStorage.getItem('tmdict.theme'));
    _theme = ["chaldea", "shadowborder"].includes(local) ? local : "chaldea";
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
};

// Book states
export const bookstore = $state({ lang: "en" });
