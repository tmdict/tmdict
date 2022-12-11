<script>
  import { navLang, navIndex, filterSrc } from '../stores.js';

  export let lang;
  export let nlang;
  export let index;
  export let all;
</script>

{#each index as idx, i}<span class:first={i === 0}><a class:active={$navLang === nlang && $navIndex === idx.id} href="../{lang}/#?nav={nlang}.{idx.id}{($filterSrc) ? `&src=${$filterSrc}` : ''}" title="{idx.name}">{idx.name}</a></span>{/each}<span><a class:active={$navLang === nlang && $navIndex === ''} href="../{lang}/#?nav={nlang}{($filterSrc) ? `&src=${$filterSrc}` : ''}" title={all}>{all}</a></span>
