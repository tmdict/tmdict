<script>
  // Load images to be enhanced
  const icons = import.meta.glob(
    "$lib/__generated/img/profile/icon/*.png", {
      eager: true,
      import: 'default',
      query: {
        enhanced: true,
      },
    }
  );

  let { lang, entry, i18n } = $props();

  function getIconImage(uid) {
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
    return icons[`/src/lib/__generated/img/profile/icon/${name}.png`];
  }
</script>

<div class="icon">
  <enhanced:img
    src={getIconImage(entry.uid)}
    alt="{entry.name[lang]}"
    style:width="50px"
    style:margin="2px"
    loading="lazy"
  />
</div>
<div class="id">{(entry.uid.split(":")[1] === "fgosvt") ? entry.uid.split(":")[0] : "-"}</div>
<div class="name">{entry.name[lang]}</div>
<div class="star">{i18n["star"][entry.star][lang]}</div>

<style>
  .icon {
    float: left;
    width: 54px;
    height: 54px;
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