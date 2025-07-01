<script>
  import Metadata from "$lib/components/entry/Metadata.svelte";
  import APP from "$lib/__generated/constants.json";

  let { lang, data } = $props();
  let isHover = $state(false);
  let contentLang = $derived(lang);

  function updateContentLang(localLang) {
    contentLang = localLang;
  }

  function getImage(uid, format) {
    const [type, id] = uid.split(":");
    const dir = type === "fgosvt" ? type : "icon";
    const file = type === "default" ? "0000" : id;
    return `/__generated/img/${format}/profile/${dir}/${file}${(type === "fgosvt" && isHover) ? "a" : ""}.${format}`;
  }
</script>

<div class="icon" role="presentation" onmouseenter={() => isHover = true} onmouseleave={() => isHover = false}>
  <picture>
    <source srcset={getImage(data.attribute.uid, "avif")} type="image/avif" />
    <img src={getImage(data.attribute.uid, "jpg")} 
      title={data.attribute.name[lang]}
      alt={data.attribute.uid}
    />
  </picture>
</div>
<div class="content">
  <div class="top">
    <div class="attribute">
      <Metadata {data} language={Object.keys(data.attribute.layout)} {updateContentLang} />

      <div>
        <table><tbody>
          {#if data.attribute.uid.split(":")[1] === "fgosvt"} 
            <tr><td class="title">ID</td><td>{data.attribute.uid.split(":")[0]}</td></tr>
          {/if}
          {#each data.attribute.layout[contentLang] as section, i (i)}
            {#each Object.keys(section) as attr, j (attr)}
              <tr class:break={i !== 0 && j === 0}>
                <td class="title">{APP.i18n[attr][contentLang]}</td>
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
  .icon {
    text-align: center;
  }
  
  .icon img {
    border: 1px solid #baaf81;
    outline: 2px solid #baaf81;
    outline-offset: 1px;
  }

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
    margin-left: 2px;
    width: 100%;
  }

  .attribute td:nth-child(1) {
    color: var(--text-light);
  }

  @media only screen and (max-width: 660px) {
    .top {
      display: flex;
      flex-wrap: wrap;
    }

    .attribute {
      margin-left: 0;
    }
  }
</style>
