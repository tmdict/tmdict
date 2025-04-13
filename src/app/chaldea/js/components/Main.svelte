<script>
  import Top from './Top.svelte';
  import Content from './Content.svelte';
  import Footer from './Footer.svelte';

  import APP from '../../__tmp/data/constants.js';
  import { activeLang } from '../stores.js';

  export let data;
  export let level;
</script>

<div id="container">
  <Top {level} />

  <div id="main">
    <Content data={data.content[0]} />

    <a href="{level}profile/#{APP.lang[$activeLang].id}">
      <img class="center" src="{level}src/img/banner_profile.png" alt="Profile" />
    </a>

    <a href="{level}glossary/#{APP.lang[$activeLang].id}">
      <img class="center" src="{level}src/img/banner_glossary.png" alt="Glossary" />
    </a>

    <div class="content">
      <table class="center" style="width:350px">
        <tr><td style="width:120px">Last Updated</td><td>2025-04-12</td></tr>
      </table> 
    </div>

    {#each data.content.slice(1) as section}
      <Content data={section} />
    {/each}
  </div>

  <Footer {level} />
</div>

<style>
  #container {
    grid-template-columns: [col-start] auto [col-1] 400px [col-2] auto [col-end];
  }

  img {
    display: block;
  }

  .center {
    margin: 15px auto;
  }

  @media only screen and (max-width: 660px) {
    #container {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: [row-start] 300px [row-1] auto [row-2] auto [row-end];
    }
  }
</style>
