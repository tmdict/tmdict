<script>
  import Theme from "$lib/components/Theme.svelte";
  import Top from "$lib/components/Top.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { store } from "$lib/util/stores.svelte.js"

  let { data, children } = $props();
</script>

<Theme />

<div id="container" lang={data.lang}>
  <Top lang={data.lang} />
  <div id="main" class:bgimg={(store.theme === "chaldea")}>
    {@render children()}
  </div>
  <Footer lang={data.lang} />
</div>

<style>
  #main {
    grid-column: col-1 / col-2;
    grid-row: row-1 / row-2;
    min-height: 400px;
    margin-top: -70px;
    border-radius: 5px;
    border: 1px solid rgba(0,0,0,.1);
    padding: 1em 1.5em;
    font: 0.9rem Verdana, Arial, "Microsoft YaHei", Meiryo, sans-serif;
  }

  #main.bgimg {
    background-image: url("$lib/img/style/bg_light.gif");
    background-image: image-set(
      url("$lib/img/style/bg_light.avif") type("image/avif"),
      url("$lib/img/style/bg_light.gif") type("image/gif")
    );
  }

  @media only screen and (max-width: 660px) {
    #main {
      grid-column: 1 / 2;
      grid-row: row-1 / row-2;
      border-radius: 0;
      font-size: 1rem;
      padding: 1em 1em;
    }
  }
</style>
