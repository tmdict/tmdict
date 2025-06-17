<script>
  import Metadata from "$lib/components/entry/Metadata.svelte";
  import APP from "$lib/__generated/constants.json";

  let { lang, data, screenWidth } = $props();
  let contentLang = $derived(lang);

  function updateContentLang(localLang) {
    contentLang = localLang;
  }

  function getImage(uid, format) {
    let name = "";
    const parsedUid = uid.split(":");
    switch (parsedUid[parsedUid.length - 1]) {
      case "fgosvt": {
        name = `S${parsedUid[0].toString().padStart(4, "0")}`;
        break;
      }
      case "default": {
        name = "0000";
        break;
      }
      default: {
        name = `${parsedUid[0]}`;
        break;
      }
    }
    return `/__generated/img/profile/icon/${format}/${name}.${format}`;
  }
</script>

<div class="profile-image">
  <picture>
    <source srcset={getImage(data.attribute.uid, "avif")} type="image/avif" />
    <img src={getImage(data.attribute.uid, "jpg")} 
      id={data.attribute.uid}
      title={data.attribute.uid}
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
          {#each data.attribute.layout[contentLang] as section, i}
            {#each Object.keys(section) as attr, j}
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
  .profile-image {
    text-align: center;
  }
  
  .profile-image img {
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
