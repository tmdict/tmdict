<script>
  import APP from "$lib/__generated/constants.json";

  let { lang, attribute, content } = $props()

  let screenWidth = $state(0);
  let screenTop = $state(0);
  let screenLeft = $state(0);

  function preventDefault(fn) {
    return function (event) {
      event.preventDefault();
      fn.call(this, event);
    };
  }

  function scrollTo(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }
</script>

<svelte:window bind:innerWidth={screenWidth} bind:scrollY={screenTop} />

<div class="sidebar" style="top: {(screenTop > 300) ? 0 : (300-screenTop)}px; left: {0.5*screenWidth+410}px">
  <ul>
    {#if content.length > 0}
      <li class="sidebar-item"><a href="#{attribute.id}">TOP</a></li>
      {#each content as section}
        {#if section.i18n[lang]}
          <li class="sidebar-item">
            <a onclick={preventDefault(scrollTo(`${section.id}`))} href={`#${section.id}`}>
              <div class="status">{section.i18n[lang].name.name}</div>
            </a>
          </li>
        {/if}
      {/each}
    {/if}
    <li class="sidebar-item"><a href="/contact/#{lang}.{attribute.id}">{APP.i18n.report[lang]}</a></li>
    {#if attribute.type === "glossary"}
      <li class="sidebar-item"><a href="/legacy/{lang}/{attribute.ja}.{attribute.id}.html">{APP.i18n.legacy[lang]}</a></li>
    {/if}
    <li class="sidebar-item"><a href="/{lang}/{attribute.type}">BACK</a></li>
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
