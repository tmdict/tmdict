<script>
  import { page } from "$app/state";

  const title = page.url.hash.substring(1);
</script>

<svelte:head>
  <title>Contact | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/contact" />
</svelte:head>

<h1>Contact <span style="color:#777;">§</span> <span style="color:#c05b4d;font-size:0.85em">发送消息</span></h1>
<br />
<div class="content">
  <form 
    name="contact" 
    method="POST" 
    data-netlify="true" 
    netlify-honeypot="bot-field"
  >
    <input type="hidden" name="form-name" value="contact" />
    <label class="hidden">Don't fill this out if you're human <input name="bot-field" /></label>
    <label for="name">Name · 姓名 <input type="text" name="name" id="name" required /></label><br />
    <label for="email">Email · 联系邮箱 <input type="email" name="email" id="email" required /></label><br />
    <label for="title">Topic · 标题 <input type="text" name="title" id="title" value="{title}" required /></label><br />
    <label for="message">Message · 内容 <textarea name="message" id="message" required></textarea></label><br />
    <div class="button"><button type="submit">Send</button></div>
  </form>
</div>

<style>
  .hidden { 
    display: none; 
  }

  form {
    margin: 0 auto;
    max-width: 500px;
  }

  label {
    display: block;
    margin-top: 20px;
    font-weight: bold;
  }

  input,
  textarea {
    display: block;
    width: 100%;
    padding: 8px 12px;
    margin-top: 8px;
    font-size: 15px;
    color: #333;
    background-color: rgba(255,255,255,.8);
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  textarea {
    height: 150px;
    resize: vertical;
  }

  .button {
    margin-top: 20px;
    text-align: center;
  }

  button {
    display: inline-block;
    padding: 10px 40px;
    color: #f8f7f6;
    background: #333;
    font-size: 15px;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background: #444;
  }
</style>
