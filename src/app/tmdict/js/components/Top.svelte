<script>
  import Nav from './Nav.svelte';
  import { navLang, navIndex, filterSrc } from '../stores.js';

  import APP from '../../__tmp/data/constants.js';

  export let env;
  export let lang;
  export let filterlistIndex;

  const menuPage = ['about', 'site', 'misc'];
  const menuLang = [
    { id: 'en', name: 'EN' },
    { id: 'zh', name: 'ZH' },
    { id: 'ja', name: 'JA' },
  ];
</script>

<div class="top">
  <div class="top-img"><a title="{APP.i18n.index[lang]}" href="../{APP.lang[lang].id}/">{APP.i18n.index[lang]}</a></div>
  <div class="nav">
    <div class="nav-title"><a href="../{APP.lang[lang].id}/">TM<span class="tm">dict</span></a></div>
    <div class="nav-ver">v3</div>
    <div class="nav-index">
      <Nav index={filterlistIndex.ja} nlang={'ja'} all={'全'} {lang} /><br/>
      <Nav index={filterlistIndex.en} nlang={'en'} all={'all'} {lang} /></div>
  </div>
  <div class="side">
    <div class="search">
      <form action="search"><input type="text" name="q" id="searchbox" autoComplete="off" required="" /></form>
    </div>
    <div class="menu">
      {#each menuPage as p, i}
        {#if i !== 0}{" | "}{/if}<a title="{APP.i18n[p][lang]}" href="../{lang}/{p}{(env === 'development') ? '.html' : ''}">{APP.i18n[p][lang]}</a>
      {/each}
      {" | "}<a title="{APP.i18n.book[lang]}" href="../book/#?lang={lang}">{APP.i18n.book[lang]}</a>
    </div>
    <div class="lang">
      {#each menuLang as l, i}
        <span class:first={i === 0}><a
          class:active={lang === l.id}
          href="../{l.id}/#{($navLang !== '') ? `?nav=${$navLang}` : ''}{($navIndex !== '') ? `.${$navIndex}` : ''}{($filterSrc) ? `&src=${$filterSrc}` : ''}"
          title={l.name}>{l.name}</a></span>
      {/each}
    </div>
  </div>
</div>
