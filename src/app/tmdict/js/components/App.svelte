<script>
  import Top from './Top.svelte';
  import Main from './Main.svelte';
  import Side from './Side.svelte';
  import { navLang, navIndex, filterSrc } from '../stores.js';

  import page from 'page';

  export let data;

  const filterlistIndex = {
    en: [
      { id: '_', name: '#' },
      { id: 'a', name: 'a' },
      { id: 'b', name: 'b' },
      { id: 'c', name: 'c' },
      { id: 'd', name: 'd' },
      { id: 'e', name: 'e' },
      { id: 'f', name: 'f' },
      { id: 'g', name: 'g' },
      { id: 'h', name: 'h' },
      { id: 'i', name: 'i' },
      { id: 'j', name: 'j' },
      { id: 'k', name: 'k' },
      { id: 'l', name: 'l' },
      { id: 'm', name: 'm' },
      { id: 'n', name: 'n' },
      { id: 'o', name: 'o' },
      { id: 'p', name: 'p' },
      { id: 'q', name: 'q' },
      { id: 'r', name: 'r' },
      { id: 's', name: 's' },
      { id: 't', name: 't' },
      { id: 'u', name: 'u' },
      { id: 'v', name: 'v' },
      { id: 'w', name: 'w' },
      { id: 'x', name: 'x' },
      { id: 'y', name: 'y' },
      { id: 'z', name: 'z' },
    ],
    ja: [
      { id: '_', name: 'あ' },
      { id: 'k', name: 'か' },
      { id: 's', name: 'さ' },
      { id: 't', name: 'た' },
      { id: 'n', name: 'な' },
      { id: 'h', name: 'は' },
      { id: 'm', name: 'ま' },
      { id: 'y', name: 'や' },
      { id: 'r', name: 'ら' },
      { id: 'w', name: 'わ' },
    ],
  };

  // Prepare router state
  page('/:lang/*', (ctx) => {
    const regexNav = ctx.hash.match(/\?nav=([a-z]{2}\.?[a-zA-Z_]*)/);
    if (regexNav !== null) {
      const isJa = regexNav[1].match(/^ja.[_kstnhmyrw]|^ja$/) !== null;
      const isEn = regexNav[1].match(/^en.[a-zA-Z_]$|^en$/) !== null;
      if (isJa || isEn) {
        navLang.set(regexNav[1].split('.')[0]);
        navIndex.set(regexNav[1].split('.')[1] !== undefined ? regexNav[1].split('.')[1] : '');
      }
    } else {
      navLang.set('');
      navIndex.set('');
    }
    const regexSrc = ctx.hash.match(/src=([a-zA-Z0-9-_]*)/);
    filterSrc.set(regexSrc !== null ? regexSrc[1] : '');
  });
  // Start listening to change
  page({ click: false });
</script>

<div id="container">
  <div class="wrapper group">
    <Top lang={data.attribute.lang} {filterlistIndex} env={data.env} />
    <Main lang={data.attribute.lang} {data} {filterlistIndex} env={data.env} />
    <Side lang={data.attribute.lang} i18n={data.i18n} />
  </div>
</div>
