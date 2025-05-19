<svelte:head>
  <title>TMdict | 型月辞典</title>
  <meta charset="utf-8">
  <meta name="description" content="TMdict - a multi-lingual dictionary of vocabularies from games, books, anime, and other works by Type-Moon.">
  <link rel="canonical" href="https://www.tmdict.com/" />
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
  <style>
    body, html {
      background: #222;
    }
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

<style>
  #enter {
    margin: 10% auto;
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
</style>
