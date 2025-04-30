<script>
  import Metadata from "$lib/components/entry/Metadata.svelte";
  
  let { lang, data, entryType, entryId } = $props();
  let contentLang = $derived(lang);

  function updateContentLang(lang) {
    contentLang = lang;
  }

  function getImage(entryImg, format) {
    const img = `/__generated/img/glossary/${format}/${entryImg.split(".")[0]}.${format}`;
    return img;
  }

  function getGitUrl(source, entryId, entryType, contentId, contentLang, parent) {
    const path = entryType === "profile" ? `${source}/${entryId}/${contentId}` : `${source}/${entryId}`;
    return "https://github.com/tmdict/tmdict/blob/main/data/content/" + path;
  }
</script>

{#if data.i18n[contentLang]}
  <div id="{data.id}" class="content">
    {#if data.i18n[contentLang].name.name && entryType !== "glossary"}
      <h2>{data.i18n[contentLang].name.name} <a href="#{data.id}">#</a></h2>
    {/if}

    <Metadata
      {lang}
      {data}
      language={Object.keys(data.i18n)}
      gitUrl={getGitUrl(data.source, entryId, entryType, data.id, contentLang, data.parent)}
      {updateContentLang}
    />

    <div>{@html data.i18n[contentLang].html}</div>

    {#if data.img !== ""}
    <div class="entry-image">
      <picture>
        <source srcset={getImage(data.img, "avif")} type="image/avif" />
        <img src={getImage(data.img, "jpg")} 
          title={data.i18n[contentLang].name.name}
          alt={data.img}
          style:border="1px dashed #777"
        />
      </picture>
    </div>
    {/if}
  </div>
{/if}

<style>
  .entry-image {
    margin: 40px auto 10px;
    text-align: center;
  }
</style>
