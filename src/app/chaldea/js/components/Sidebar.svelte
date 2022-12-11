<script>
  import APP from '../../__tmp/data/constants.js';
  import { activeLang, activeLangTick } from '../stores.js';

  export let attribute;
  export let content;

  let contentLang = $activeLang;
  let screenWidth;
  let screenTop;
  let screenLeft;

  // Update local contentLang when global activeLang changes
  $: {
    $activeLangTick;
    contentLang = $activeLang;
  }

  const updateLang = (event) => (contentLang = event.detail.lang);
  const scrollTo = (id) => document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
</script>

<svelte:window bind:innerWidth={screenWidth} bind:scrollY={screenTop} />

<div class="sidebar" style="top: {(screenTop > 300) ? 0 : (300-screenTop)}px; left: {0.5*screenWidth+410}px">
  <ul>
    {#if content.length > 0}
      <li class="sidebar-item"><a href="#{contentLang}.{attribute.id}">TOP</a></li>
      {#each content as section}
        {#if section.i18n[contentLang]}
          <li class="sidebar-item">
            <a on:click|preventDefault={scrollTo(`${$activeLang}.${section.id}`)} href={`#${$activeLang}.${section.id}`}>
              <div class="status">{section.i18n[contentLang].name.name}</div>
            </a>
          </li>
        {/if}
      {/each}
    {/if}
    <li class="sidebar-item"><a href="../contact/#{[$activeLang]}-{attribute.id}">{APP.i18n.report[$activeLang]}</a></li>
    <li class="sidebar-item"><a href="../{attribute.type}/#{$activeLang}">BACK</a></li>
  </ul>
</div>

<style>
  .sidebar {
    width:200px;
    position:fixed;
  }

  .sidebar ul {
    list-style: none;
    padding: 0 20px;
  }

  .sidebar ul li {
    margin: 0 5px 5px 0;
    overflow-wrap: break-word;
  }

  .sidebar ul li a {
    display: block;
    padding: 5px 10px 5px 7px;
    border: 1px solid #baaf81;
    text-transform: uppercase;
    text-decoration: none;
    font-size: 1rem;
    font-family: Arial, "Microsoft YaHei", sans-serif;
    line-height: 1;
    color: #f7d87c;
    transition: 0.2s;
  }

  .sidebar ul li a:hover {
    color: #e9e9e9;
    background: #555;
  }

  .sidebar .status {
    border-left: 3px solid #c05b4d;
    padding-left: 8px;
  }
</style>
