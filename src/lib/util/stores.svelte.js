// Site states
let _lang = $state("en");
let _theme = $state("chaldea");
let _path = $state("");

export const store = {
  // Language
  lang: {
    get value() { return _lang; },
    set value(input) { _lang = input; },
    syncAll: () => {
      const tmp = _lang;
      _lang = ""; // Force a state change
      _lang = tmp;
    },
  },
  // Theme
  get theme() { return _theme; },
  set theme(input) { _theme = input; },
  // Current URL path
  get path() { return _path; },
  set path(input) { _path = input; },
};

// Book states
export const bookstore = $state({ lang: "en" });
