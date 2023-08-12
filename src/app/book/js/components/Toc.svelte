<script>
  import APP from '../../__tmp/data/constants.js';
  import { activeLang, currentSource } from '../stores.js';

  export let data;
  data.sort((a, b) => (a.source.weight > b.source.weight) ? -1 : 1);

  const updateActiveLang = (lang) => {
    activeLang.set(lang);
    localStorage.setItem('tmdict.book.lang', $activeLang);
  };
  const updateCurrentSource = (src) => currentSource.set(src);
</script>

<div id="toc">
  <h1>Glossary § 辞典</h1>
  <div class="centered-info">
    {#each Object.keys(APP.i18n.lang) as lang, i}
      {#if i !== 0}{' ・ '}{/if}<a on:click={() => updateActiveLang(lang)} href="#?lang={lang}">{APP.i18n.lang[lang]}</a>
    {/each}
  </div>
  <div class="centered-info">
    <a href="../{$activeLang}/">TMdict</a>
  </div>
  <div class="separator" />
  <ul>
    {#each data as book}
      <li>
        <a on:click={() => updateCurrentSource(book.source.id)} href={`#${book.source.id}`} title={book.glossary.data.name[$activeLang]}>
          <div class="info" class:new={book.source.releaseDate.split('-')[0] === '2023'}>
            {book.source.releaseDate} / {book.source.data.name[$activeLang]}
          </div>
          {book.glossary.data.name[$activeLang]}
        </a>
      </li>
    {/each}
  </ul>
  <div class="separator-small" />
</div>
