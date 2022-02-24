# TMdict Data Guildelines

## About

Quick summary of each directory and their purpose

- `attribute/`: Content attributes and metadata.
- `content/`: Content (text and translations). Contents must have a valid attribute as its parent
- `img/`: Images for attributes and contents

## Understanding the File Format

### Attributes

Attributes are categorized tags that provide additional information on the content, it can be anything, from sources and content type, to servant origin or rank. Attributes can also contain other attributes, chaining attributes together can help create more complex relationships between contents. Finally, all valid attributes can be made filterable, sortable, and linkable on the site.

### Contents

A content file represents a self-contained block of text (or translation), it can be as short as a single block of text, or as long as an entire section from a book, it can be anything as long as the text is categorized under a parent attribute.

The relationship between contents and its parent attributes are specified in the front matter (inside the `---` at the top of each file), content text is just Markdown (HTML can also be used). Soft-line break is used (as opposed to 2 spaces or `\` at the end of each line).

## Template Tags

All valid Markdown and HTML will be converted to HTML during site deployment. There are also some TMdict-specific template tags available:

<table>
  <tr>
    <th>Type</th>
    <th>Text</th>
    <th>Rendered Output</th>
  </tr>
  <tr>
    <td>Ruby Text</td>
    <td><code>[Sword of Promised Victory]{Excalibur}</code></td>
    <td><ruby>Sword of Promised Victory<rp>(</rp><rt>Excalibur</rt><rp>)</rp></ruby></td>
  </tr>
  <tr>
    <td>Diamond Line Breaks</td>
    <td><code><></code></td>
    <td>◆ (centered)</td>
  </tr>
  <tr>
    <td>Footnote Title</td>
    <td><code>{{notes}}</code></td>
    <td>Translator’s Notes / 译者注 (changes based on current language selection)</td>
  </tr>
  <tr>
    <td>Footnote Link</td>
    <td><code>Text{{n1}}</code></td>
    <td>Text<sup>[ <a title="n1" href="#">1</a> ]</sup></td>
  </tr>
  <tr>
    <td>Footnotes</td>
    <td><code>1. {{note1}} Explanation.</code></td>
    <td>1. <a href="#">^</a> Explanation.</td>
  </tr>
  <tr>
    <td>Missing Content</td>
    <td><code>{{missing}}</code></td>
    <td><a href="#">!missing・contribute</a> (link to contact form)</td>
  </tr>
</table>

The footnote tags can be used together to insert translation notes inside the text, multiple footnotes are supported, just make sure the number used in `{{nX}}` and `{{noteX}}` match, so the notes are properly linked.
