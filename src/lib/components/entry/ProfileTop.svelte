<script>
  import ImgHover from "$lib/components/entry/ImgHover.svelte";
  import ImgSwipe from "$lib/components/entry/ImgSwipe.svelte";
  import Metadata from "$lib/components/entry/Metadata.svelte";

  import APP from "$lib/__generated/constants.json";

  let { lang, data, screenWidth } = $props();
  let contentLang = $derived(lang);

  function updateContentLang(localLang) {
    contentLang = localLang;
  }
</script>

<div class="content">
  <div class="top">
    <div class="image">
      {#if screenWidth > 520}
        <ImgHover attribute={data.attribute} {contentLang} />
      {:else}
        <ImgSwipe attribute={data.attribute} />
      {/if}
    </div>

    <div class="attribute">
      <Metadata {data} language={Object.keys(data.attribute.layout)} {updateContentLang} />

      <div>
        <table><tbody>
          {#if data.attribute.uid.split(":")[1] === "fgosvt"} 
            <tr><td>ID</td><td>{data.attribute.uid.split(":")[0]}</td></tr>
          {/if}
          {#each data.attribute.layout[contentLang] as section, i}
            {#each Object.keys(section) as attr, j}
              <tr class:break={i !== 0 && j === 0}>
                <td>{APP.i18n[attr][contentLang]}</td>
                {#if ["origin", "region"].includes(attr)}
                  <td>{@html section[attr].join(" · ")}</td>
                {:else}
                  <td>{@html section[attr].join(", ")}</td>
                {/if}
              </tr>
            {/each}
          {/each}
        </tbody></table>
      </div>
    </div>
  </div>
</div>

<style>
  .top {
    display: flex;
    position: relative;
    top: 0;
    left: 0;
    margin: 2em auto 2em;
  }

  .top:after {
    content: none;
  }

  .attribute {
    margin-left: 18px;
    width: 100%;
  }

  table {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  tr {
    padding: 1px 0;
    line-height: 1.2rem;
    font-size: 0.75rem;
  }

  td:nth-child(1) {
    width: 150px;
    color: var(--text-light);
  }

  @media only screen and (max-width: 840px) {
    table {
      width: 346px;
    }
  }

  @media only screen and (max-width: 660px) {
    .top {
      display: flex;
      flex-wrap: wrap;
    }

    .attribute { margin-left: 0; }
    table { width: 100%; }
    td:nth-child(1) { width: 140px; }
  }
</style>
