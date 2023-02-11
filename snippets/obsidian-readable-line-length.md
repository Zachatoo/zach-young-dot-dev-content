---
title: "Obsidian readable line length"
createdAt: "2023-02-11"
description: "Customizing the readable line length setting."
tags:
  - obsidianmd
  - css
---

To create a CSS snippet, create a `.css` file in the `.obsidian/snippets` folder in your vault, and then turning on the snippet in Settings > Appearance. It's easiest to edit `.css` files in a text editor like Visual Studio Code to get highlighting and formatting.

## Readable line length per file

This CSS snippet will allow you to turn on readable line length on a per file basis. The CSS is copied from Obsidian's CSS, but I changed `is-readable-line-width` to `readable-line-width` to be used with the Obsidian `css-class` metadata property.

You'll need to turn off the readable line length setting in Settings > Editor.

```css title="readable-line-width-per-file.css"
.markdown-source-view.readable-line-width .CodeMirror,
.markdown-source-view.mod-cm6.readable-line-width .cm-sizer,
.markdown-preview-view.readable-line-width .markdown-preview-sizer {
  max-width: var(--file-line-width);
  margin-left: auto;
  margin-right: auto;
}

.markdown-source-view.mod-cm6.readable-line-width .cm-content,
.markdown-source-view.mod-cm6.readable-line-width .cm-line {
  max-width: var(--file-line-width);
}
```

To enable readable line width in a file, add the following YAML to the top of the files you want to have readable line length turned on for.

```yaml title="Your Note.md"
---
cssclass: readable-line-width
---
```

## Custom width

Changes the width of the readable line length setting to a specified amount. Check the [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width) for valid max-width values.

```css title="custom-readable-line-length"
:root {
  --custom-readable-line-width: 1000px; /* set width here */
}

.markdown-source-view.is-readable-line-width .CodeMirror,
.markdown-source-view.mod-cm6.is-readable-line-width .cm-sizer,
.markdown-preview-view.is-readable-line-width .markdown-preview-sizer {
  max-width: var(--custom-readable-line-width);
  margin-left: auto;
  margin-right: auto;
}

.markdown-source-view.mod-cm6.is-readable-line-width .cm-content,
.markdown-source-view.mod-cm6.is-readable-line-width .cm-line {
  max-width: var(--custom-readable-line-width);
}
```
