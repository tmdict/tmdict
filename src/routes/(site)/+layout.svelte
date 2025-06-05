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
    background: var(--bg-main);
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
    background-image: url("$lib/img/bg_light.gif");
    background-image: image-set(
      url("$lib/img/bg_light.avif") type("image/avif"),
      url("$lib/img/bg_light.gif") type("image/gif")
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

  #main :global {
    .content {
      line-height: 1.5rem;
      margin-bottom: 30px;
    }

    @media only screen and (max-width: 660px) {
      .content {
        line-height: 1.8rem;
      }
    }

    .content:after {
      content: var(--content-break);
      display: flex;
      justify-content: center;
      margin-top: 50px;
    }

    .content .note {
      font-weight: bold;
      margin: 0 1px 0 3px;
    }

    .content .note:before {
      font-weight: normal;
      content: "[";
    }

    .content .note:after {
      font-weight: normal;
      content: "]";
    }

    .content .notelink {
      font-weight: bold;
      text-decoration: none;
    }

    .content .contact a {
      color: var(--primary-heading);
      text-decoration: none;
      border-bottom: 1px dotted #aaa;
    }

    .content .contact a:hover {
      color: var(--primary-link);
    }

    .content .contact:before {
      content: "[";
      margin-left: 3px;
      color: var(--text-light);
    }

    .content .contact:after {
      content: "]";
      margin-right: 3px;
      color: var(--text-light);
    }

    .content table {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    .content tr {
      padding: 1px 0;
      line-height: 1.2rem;
      font-size: 0.75rem;
    }

    .content tr:nth-child(odd) {
      background: var(--bg-row-grey-light);
    }

    .content tr:hover {
      background: var(--bg-row-grey-dark);
    }

    .content tr.break td {
      border-top: 1px dotted #aaa;
    }

    .content td:nth-child(1) {
      width: 240px;
      font-weight: bold;
    }

    .content td .source {
      color: var(--primary-link-highlight);
    }

    .content td .glossary {
      color: var(--primary-link);
      font-weight: normal;
    }

    .content td .page {
      color: #777;
      font-weight: normal;
    }

    @media only screen and (max-width: 660px) {
      .content td:nth-child(1) {
        width: 140px;
      }
    }
  }
</style>
