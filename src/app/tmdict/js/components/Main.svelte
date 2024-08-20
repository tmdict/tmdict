<script>
  import NewsEn from './news/En.svelte';
  import NewsJa from './news/Ja.svelte';
  import NewsZh from './news/Zh.svelte';
  import { navLang, navIndex, filterSrc } from '../stores.js';

  export let env;
  export let lang;
  export let data;
  export let filterlistIndex;

  const pageComponent = {
    en: { component: NewsEn },
    ja: { component: NewsJa },
    zh: { component: NewsZh },
  };

  // Returns an array of objects, each representing an index + entries
  const getFilterlistEntry = (nl, ni, src) => {
    const filteredContent = data.content.reduce((acc, entry) => {
      // Add to array if 'all' or current id matches selected index
      const nlId = nl === 'en' ? 'en' : 'jaRow';
      if ((ni === '' || entry[nlId] === ni) && (src === '' || entry.source.includes(src))) {
        // Instantiate object for current index
        if (!(entry[nlId] in acc)) {
          acc[entry[nlId]] = [];
        }
        acc[entry[nlId]].push(entry);
      }
      return acc;
    }, {});
    const result = filterlistIndex[nl].reduce((acc, nIdName) => {
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
  };
</script>

<div class="main">
  <div class="main-content">
    {#if $navLang}
      <div class="filter-list">
        {#each getFilterlistEntry($navLang, $navIndex, $filterSrc) as navSection}
          <h2>{navSection.name}</h2>
          <ul>
            {#each navSection.entries as entry, i}
              <li><a href="{entry.ja}.{entry.id}{(env === 'development') ? '.html' : ''}" title={entry.name}>
                <div class="entry filter-list-item group" class:first={i===0}>
                  <div class="entry-title">{entry.name}</div>
                  <div class="entry-category">
                    {#if entry.category.length !== 0}
                      {#each entry.category as category, j}
                        {(j !== 0) ? ' / ' : ''}{data.i18n.category[category][lang]}
                      {/each}
                    {:else}
                      -
                    {/if}
                  </div>
                  <div class="entry-source">
                    {#each entry.work as work, k}
                      {(k !== 0) ? ', ' : ''}{data.i18n.work[work][lang]}
                    {/each}
                  </div>
                </div>
              </a></li>
            {/each}
          </ul>
        {/each}
      </div>
    {:else}
      <svelte:component this={pageComponent[lang].component} />
    {/if}
  </div>
</div>
