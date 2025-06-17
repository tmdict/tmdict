<script>
  let { lang, entry, i18n } = $props();

  function getImage(uid, format) {
    let name = "";
    const parsedUid = uid.split(":");
    switch (parsedUid[parsedUid.length - 1]) {
      case "fgosvt": {
        name = `fgosvt/${parsedUid[0]}`;
        break;
      }
      case "default": {
        name = "icon/0000";
        break;
      }
      default: {
        name = `icon/${parsedUid[0]}`;
        break;
      }
    }
    return `/__generated/img/${format}/profile/${name}.${format}`;
  }
</script>

<div class="icon">
  <picture>
    <source srcset={getImage(entry.uid, "avif")} type="image/avif" />
    <img src={getImage(entry.uid, "jpg")} 
      id={entry.uid}
      title={entry.name[lang]}
      alt={entry.name[lang]}
      loading="lazy"
    />
  </picture>
</div>
<div class="id">{(entry.uid.split(":")[1] === "fgosvt") ? entry.uid.split(":")[0] : "-"}</div>
<div class="name">{entry.name[lang]}</div>
<div class="star">{i18n["star"][entry.star][lang]}</div>

<style>
  .icon img {
    float: left;
    width: 50px;
    height: 50px;
    margin: 2px;
  }

  .id {
    float: left;
    width: 40px;
    margin: 6px 6px 6px 10px;
  }

  .name {
    float: left;
    margin: 6px;
    font-weight: bold;
    width: calc(100% - 208px);
  }

  .star {
    color: #baaf81;
    float: right;
    text-align: left;
    margin: 6px 10px 6px 6px;
    width: 70px;
  }
</style>
