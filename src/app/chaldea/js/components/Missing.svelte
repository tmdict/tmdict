<script>
  import Top from './Top.svelte';
  import Footer from './Footer.svelte';

  import { activeLang } from '../stores.js';

  export let data;
  export let level;

  const getEntryUrl = (e, lang) => {
    const section = e.sectionId ? `.${e.sectionId}` : '';
    const ext = data.env === 'production' ? '' : '.html';
    return `${level}${e.type}/${e.id}${ext}#${e.lang}${section}`;
  };
</script>

<div id="container">
  <Top {level} />

  <div id="main">
    <div class="content">
      <h1>Missing</h1>
      <br />
      <table>
        {#each data.missing[$activeLang] as entry}
          <tr>
            <td><a href={getEntryUrl(entry)}>{entry.name}</a></td>
            <td><a href={getEntryUrl(entry)}>{entry.sectionName}</a></td>
          </tr>
        {/each}
      </table>
    </div>
  </div>

  <Footer {level} />
</div>

<style>
  #container {
    grid-template-columns: [col-start] auto [col-1] 400px [col-2] auto [col-end];
  }
  td a { 
    display: block;
    text-decoration: none;
  }
  @media only screen and (max-width: 660px) {
    #container {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: [row-start] 300px [row-1] auto [row-2] auto [row-end];
    }
  }
</style>
