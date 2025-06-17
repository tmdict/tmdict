<script>
  let { lang, entry, i18n } = $props();
  let isHover = $state(false);

  function getImage(uid, format) {
    const [type, id] = uid.split(":");
    const dir = type === "fgosvt" ? type : "icon";
    const file = type === "default" ? "0000" : id;
    return `/__generated/img/${format}/profile/${dir}/${file}${(isHover && type === "fgosvt") ? "a" : ""}.${format}`;
  }
</script>

<div class="profile" role="presentation" onmouseenter={() => isHover = true} onmouseleave={() => isHover = false}>
  <div class="icon">
    <picture>
      <source srcset={getImage(entry.uid, "avif")} type="image/avif" />
      <img src={getImage(entry.uid, "jpg")} 
        title={entry.name[lang]}
        alt={entry.uid}
        loading="lazy"
      />
    </picture>
  </div>
  <div class="id">{(entry.uid.split(":")[0] === "fgosvt") ? entry.uid.split(":")[1] : "-"}</div>
  <div class="name">{entry.name[lang]}</div>
  <div class="star">{(entry.star[0] !== "_na") ? i18n["star"][entry.star[0]][lang] : ""}</div>
</div>

<style>
  .profile {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

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
