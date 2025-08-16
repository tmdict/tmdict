<script>
  import afkj from "$lib/img/link_afkj.png?enhanced";
  import mhy from "$lib/img/link_mhy.png?enhanced";
  import tsukikan from "$lib/img/link_tsukikan.png?enhanced";
  import legacy from "$lib/img/link_chaldea.png?enhanced";
</script>

<svelte:head>
  <title>TMdict | 型月辞典</title>
  <meta charset="utf-8" />
  <meta name="description" content="TMdict - a multi-lingual dictionary of vocabularies from games, books, anime, and other works by Type-Moon." />
  <link rel="canonical" href="https://www.tmdict.com/" />
  <style>
    body, html { background: #222; }
  </style>
</svelte:head>

<div id="enter">
  <div class="enter-block">
    <div class="enter-item first"><a href="en/">English</a></div>
    <div class="enter-item"><a href="zh/">中文</a></div>
    <div class="enter-item"><a href="ja/">日本語</a></div>
    <div class="enter-item extra last"><a href="book/">Books</a></div>
  </div>
</div>

<div id="banners">
  <div class="banner-block">
    <a class="project" href="https://stargazer.tmdict.com/" aria-label="Stargazer">
      <enhanced:img src={afkj} title="Stargazer" alt="Stargazer" style="display: block;" />
    </a>
  </div>
  <div class="banner-block">
    <a class="project" href="https://mhy.tmdict.com/" aria-label="mHY一图流">
      <enhanced:img src={mhy} title="mHY一图流" alt="mHY一图流" style="display: block;" />
    </a>
  </div>
  <div class="banner-block">
    <a class="project" href="https://tsukikan.com/" aria-label="Tsukikan">
      <enhanced:img src={tsukikan} title="Tsuki-kan" alt="Tsuki-kan" style="display: block;" />
    </a>
  </div>
  <div class="banner-block">
    <a class="project" href="/legacy/en/index.html" aria-label="Classic">
      <enhanced:img src={legacy} title="Classic" alt="Classic" style="display: block;" />
    </a>
  </div>
</div>

<style>
  #enter {
    margin: 10% auto 70px;
    width: 150px;
  }

  .enter-block {
    background: #fff url("$lib/img/enter.png") no-repeat top;
    padding-top: 184px;
    border-radius: 15px;
  }

  .enter-item {
    text-align: center;
    border-top: 1px dotted #ccc;
  }

  .enter-item a {
    display: block;
    color: #36958e;
    font: normal 1.4em "Microsoft YaHei", Sans-Serif;
    letter-spacing: 0.2em;
    text-decoration: none;
    padding: 10px 0;
  }

  .enter-item a:hover {
    color: #c05b4d;
    background: #eee;
  }

  .first {
    border-top: 0;
  }

  .last {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  .last a {
    height: 30px;
  }

  .last a:hover {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  .extra {
    border-top: 3px double #aaa;
    border-width: 4px;
  }

  #banners {
    margin: 10px auto;
    width: 150px;
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
  }

  .banner-block {
    padding: 0 0 6px 0;
    display: flex;
    justify-content: center;
  }

  .banner-block:last-child {
    padding-bottom: 0;
  }

  .banner-block a {
    filter: grayscale(0.4);
    opacity: 0.9;
  }

  .banner-block a:hover {
    filter: grayscale(0);
    opacity: 1;
  }
</style>
