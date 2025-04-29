<script>
  import { page } from "$app/state";

  const title = page.url.hash.substring(1);
</script>

<svelte:head>
  <title>Contact | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/contact/" />
</svelte:head>

<h1>Contact <span style="color:#777;">§</span> <span style="color:#c05b4d;font-size:0.85em">发送消息</span></h1>
<br />
<div class="content">
  <form id="contact" name="contact" method="POST" netlify-honeypot="bot-field" netlify>
    <label class="hidden">Don"t fill this out if you"re human <input class="form" name="bot-field" /></label>
    <label for="name">Name · 姓名 <input class="form" type="text" name="name" id="name" /></label><br />
    <label for="email">Email · 联系邮箱 <input class="form" type="text" name="email" id="email" /></label><br />
    <label for="title">Topic · 标题 <input class="form" type="text" name="title" id="title" value="{title}" /></label><br />
    <label for="message">Message · 内容 <textarea class="form" name="message" id="message"></textarea></label><br />
    <div class="button"><button type=”submit”>Send</button></div>
  </form>
</div>

<style>
  .hidden { display: none; }

  #contact label {
    margin-top: 20px;
    font-weight: bold;
  }

  #contact .form {
    display:block;
    width: 95%;
    max-width: 350px;
    height: 20px;
    padding: 5px 10px;
    font-size: 15px;
    color: #333;
    background-color: rgba(255,255,255,.8);
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  #contact textarea.form { height: 150px; }

  #contact .button {
    text-align: center;
  }

  #contact button {
    display: inline-block;
    padding: 10px 40px;
    color: #f8f7f6;
    background: #333;
    font-size: 15px;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
