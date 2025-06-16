# TMdict Data Guidelines

## Overview

This guide explains how to navigate and contribute content for TMdict. Here's an overview of the folder structure:

- `attribute/`: Contains attribute information about terms, profiles, and other related elements (like their class, origin, etc.)
- `content/`: Contains the actual text content and translations. Contents must have a valid attribute as its parent
- `img/`: Stores images used in the site

## How Content is Organized

### Attributes (Metadata)

Attributes are labels or tags that provide information about the content. It can be anything, such as content source and content type, 
or servant origin or rank.

Attributes can contain other attributes, chaining attributes together can help create more complex relationships between 
contents. Finally, all valid attributes can be used to filter or sort content on the site.

### Contents

A content is a block of text (or translation), it can be as short as a single block of text, or as long as an entire section from 
a book.

All content must have a parent attribute, which helps group contents together into collections of entries such as 
a full profile or glossary book. A content's parent attribute, as well as other metadata, can be found at the top of a file 
inside the `---` (called "frontmatter").

## How to Contribute Content

### Find the File

- Navigate to the `data` folder
- Find the file you want to edit (either in `attribute/` or `content/`)

### Edit the File

- Click the pencil icon in the top-right corner of the file
- Make your changes in the editor
- You can preview how your changes will look by clicking the "Preview" tab

### Submit Your Changes

- Click the green "Commit changes" button
- Optionally add a brief description of your changes in the "Commit changes" box
- Your changes will be reviewed by the team
- If approved, they'll be added to the site in the next update
- If changes are needed, you'll be notified with feedback

### Tips for Editing

- Always make sure to follow the formatting guidelines below
- Test your changes using the preview feature
- Make small, focused changes rather than many changes at once

## Formatting Content

Content formatting can be accomplished by using either Markdown or HTML. All valid Markdown and HTML will be converted to HTML during site deployment.

When using Markdown, soft-line break is used (as opposed to 2 spaces or `\` at the end of each line). Additional template tags that
are available:

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
