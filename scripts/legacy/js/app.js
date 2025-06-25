let navLang = "ja";
let navId = "";
let filterSrc = "";

// Returns an array of objects, each representing an index + entries
function getFilterlistEntry(data, nav, nl, ni, src) {
  const filteredContent = data.reduce((acc, entry) => {
    // Add to array if "all" or current id matches selected index
    const nlId = nl === "en" ? "en" : "ja";
    if ((ni === "" || entry[nlId][0] === ni) && (src === "" || entry.source.includes(src))) {
      // Instantiate object for current index
      if (!(entry[nlId][0] in acc)) {
        acc[entry[nlId][0]] = [];
      }
      acc[entry[nlId][0]].push(entry);
    }
    return acc;
  }, {});
  const result = nav[nl].reduce((acc, nIdName) => {
    if (filteredContent[nIdName.id]) {
      // Add to collection if entries under this index exists
      acc.push({
        name: nIdName.name,
        entries: filteredContent[nIdName.id],
      });
    }
    return acc;
  }, []);
  return result;
}

// Return an array of filters
function getFilters(sources, lang) {
  return Object.keys(sources)
    .map((id) => {
      return {
        id: id,
        name: sources[id][lang],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

m.mount(document.getElementById("container"), {
  view: function() {
    // Get filters
    const filters = getFilters(data.i18n.source, metadata.lang);
    // Update states
    const query = m.parseQueryString(window.location.search);
    navLang = ["en", "ja"].includes(query.nl) ? query.nl : "ja";
    navId = metadata.nav[navLang].some(n => n.id === query.ni) ? query.ni : "";
    filterSrc = filters.some(f => f.id === query.fs) ? query.fs : "";
    // Get filtered list
    const filteredList = getFilterlistEntry(data.filterlist, metadata.nav, navLang, navId, filterSrc);
    return m("div.wrapper group", [
      m("div.top", [
        // Top Image Link
        m("div.top-img", 
          m("a", { title: metadata.i18n.index[metadata.lang], href: `../${metadata.lang}/index.html` }, metadata.i18n.index[metadata.lang])
        ),
        // Nav
        m("div.nav", [
          // Nav Title
          m("div.nav-title", 
            m("a", { href: `../${metadata.lang}/index.html` }, "TM", m("span.tm", "dict"))
          ),
          // Nav Index
          m("div.nav-index", [
            // Ja Nav
            metadata.nav.ja.map((item, index) =>
              m("span", { class: index === 0 ? "first" : "" }, 
                m("a", {
                  href: `../${metadata.lang}/index.html?nl=ja&ni=${item.id}&fs=${filterSrc}`,
                  class: (navLang === "ja" && navId === item.id) ? "active" : "",
                  title: item.name
                }, item.name)
              )
            ),
            // "全" Link
            m("span", 
              m("a", {
                href: `../${metadata.lang}/index.html?nl=ja&fs=${filterSrc}`, 
                class: (navLang === "ja" && navId === "") ? "active" : "",
                title: "全"
              }, "全")
            ),
            m("br"),
            // En Nav
            metadata.nav.en.map((item, index) =>
              m("span", { class: index === 0 ? "first" : "" }, 
                m("a", {
                  href: `../${metadata.lang}/index.html?nl=en&ni=${item.id}&fs=${filterSrc}`,
                  class: (navLang === "en" && navId === item.id) ? "active" : "",
                  title: item.name
                }, item.name)
              )
            ),
            // "all" Link
            m("span", 
              m("a", {
                href: `../${metadata.lang}/index.html?nl=en&fs=${filterSrc}`,
                class: (navLang === "en" && navId === "") ? "active" : "",
                title: "all"
              }, "all")
            )
          ])
        ]),
        // Top Side
        m("div.side", [
          // Search Form
          m("div.search", 
            m("form", { action: "../../search" },
              m("input", { type: "text", name: "q", id: "searchbox", autoComplete: "off", required: true })
            )
          ),
          // Menu Links
          m("div.menu", [
            m("a", { title: metadata.i18n.about.lang, href: `../${metadata.lang}/about.html` }, metadata.i18n.about[metadata.lang]),
            " | ",
            m("a", { title: metadata.i18n.site.lang, href: `../${metadata.lang}/site.html` }, metadata.i18n.site[metadata.lang]),
            " | ",
            m("a", { title: metadata.i18n.misc.lang, href: `../${metadata.lang}/misc.html` }, metadata.i18n.misc[metadata.lang]),
            " | ",
            m("a", { title: metadata.i18n.book.lang, href: "../../book/" }, metadata.i18n.book[metadata.lang])
          ]),
          // Language Switcher
          m("div.lang", [
            m("span.first", 
              m("a", { class: metadata.lang === "en" ? "active" : "", href: `../en/index.html`, title: "EN" }, "EN")),
            m("span", 
              m("a", { class: metadata.lang === "zh" ? "active" : "", href: `../zh/index.html`, title: "ZH" }, "ZH")),
            m("span", 
              m("a", { class: metadata.lang === "ja" ? "active" : "", href: `../ja/index.html`, title: "JA" }, "JA")
            )
          ])
        ])
      ]),
      m("div.main",
        m("div.main-content",
          m("div.filter-list", filteredList.map(section => {
            return [
              m("h3", section.name),
              m("ul", section.entries.map((entry, index) => {
                return m("li", 
                  m("a", {href: `${entry.hiragana}.${entry.id}.html`, title: entry.name},
                    m("div.entry.filter-list-item.group", {class: (index === 0) ? " first" : ""},
                      m("div.entry-title", entry.name),
                      m("div.entry-category", entry.category.length === 0 ? "-" : entry.category.map((category, i) => {
                        return ((i !== 0) ? " / " : "") + data.i18n.category[category][metadata.lang]
                      })),
                      m("div.entry-source", entry.work.map((work, j) => {
                        return ((j !== 0) ? ", " : "") + data.i18n.work[work][metadata.lang]
                      }))
                    )
                  )
                )
              }))
            ]
          }))
        )
      ),
      m("div.side",
        m("div.side-content", [
          // Side Title
          m("div.side-title", [
            m("span.first-char", metadata.i18n.source.en[0]), // Sidebar first name
            metadata.i18n.source.en.substring(1)  // Sidebar last name
          ]),
          // Side Filters
          m("ul", [
            m("li", { class: filterSrc === "" ? "active" : "" },
              m("a", {href: `../${metadata.lang}/index.html?nl=${navLang}&ni=${navId}`},
                m("div.entry.group", 
                  m("div.entry-source", "all"),
                )
              )
            ),
            filters.map(filter => {
              return m("li", { class: filterSrc === filter.id ? "active" : "" },
                m("a", {href: `../${metadata.lang}/index.html?nl=${navLang}&ni=${navId}&fs=${filter.id}`},
                  m("div.entry.group", 
                    m("div.entry-source", filter.name),
                  )
                )
              )
            })
          ]),
          // Side Back
          m("div.side-back", 
            m("div.center", 
              m("a", { href: metadata.back }, 
                m("img", { src: "../img/chaldea.png", alt: "CHALDEAの記録" })
              )
            )
          ),
          // Side Menu (Return link)
          m("div.side-menu", 
            m("div.menu-arrow", 
              m("a", { title: metadata.i18n.return[metadata.lang], href: `../../${metadata.lang}/glossary` }, "«")
            )
          )
        ])
      )
    ])
  }
});
