<script>
  import APP from '../../__tmp/data/constants.js';
  import { activeLang } from '../stores.js';

  export let level;
  export let name = '';
</script>

<div id="footer">
  <a href="{level}contact/#{name}">{APP.i18n.contact[$activeLang]}</a> · <a href="https://github.com/tmdict/tmdict/tree/main/data">{APP.i18n.contribute[$activeLang]}</a> · <a href="https://www.tmdict.com/{$activeLang}/">TMdict</a>
</div>
