// Site states
let _theme = $state("chaldea");

export const store = {
  // Theme
  get theme() { return _theme; },
  set theme(input) { _theme = input; },
};

// Book states
export const bookstore = $state({ lang: "en" });
