<script>
  import EditIcon from "$lib/components/svg/Edit.svelte"
  import APP from "$lib/__generated/constants.json";
  import { bookstore } from "$lib/util/stores.svelte.js"

  let { entry } = $props();
  let contentLang = $derived(bookstore.lang);

  function preventDefault(fn) {
    return function (event) {
      event.preventDefault();
      fn.call(this, event);
    };
  }
  
  function updateContentLang(lang) {
    contentLang = lang;
  }

  function getImage(entryImg, format) {
    const img = `/__generated/img/${format}/glossary/${entryImg.split(".")[0]}.${format}`;
    return img;
  }
</script>

<div class="entry" id={`${entry.source}.${entry.parent}`} lang={contentLang}>
  <div class="entry-header group">
    <div class="entry-title">{entry.name[contentLang]}</div>
    <div class="permalink">
      <a href={`#${entry.source}.${entry.parent}`} title={entry.name[contentLang]}>#</a>
    </div>
  </div>

  <div class="entry-lang group">
    <a href={`https://github.com/tmdict/tmdict/blob/main/data/content/${entry.source}/${entry.parent}.${contentLang}.md`}>
      <EditIcon />
    </a>{" ・ "}
    {#each Object.keys(APP.lang) as lang, i}
      {#if i !== 0}{" ・ "}{/if}
      <a class:active={contentLang === lang} onclick={preventDefault(() => updateContentLang(lang))} href="#{entry.source}.{entry.parent}">{APP.lang[lang].name}</a>
    {/each}
  </div>

  <div class="entry-main group">
    {#if entry.i18n[contentLang].category.length > 0}
      <div class="entry-category">
        {entry.i18n[contentLang].category.map(c => c.name).join("/")}
      </div>
    {/if}
    <div class="entry-content">{@html entry.i18n[contentLang].html}</div>
    {#if entry.img}
      <div class="group">
        <div class="entry-image">
          <picture>
            <source srcset={getImage(entry.img, "avif")} type="image/avif" />
            <img src={getImage(entry.img, "jpg")} 
              title={entry.name[contentLang]}
              alt={entry.img}
              loading="lazy"
            />
          </picture>
        </div>
      </div>
    {/if}
  </div>
</div>
