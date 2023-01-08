---
title: "Templater snippets"
createdAt: "2022-02-07"
description: "Snippets I've written for the Templater Obsidian plugin."
tags:
  - obsidianmd
---

Snippets I've written for the [Templater](https://github.com/SilentVoid13/Templater) Obsidian plugin.

## Using `tp.file.include` in a user script

In order to use `tp.file.include` in a user script, you must return the result of `tp.file.include` at the end of the function. The `return` keyword is important.

```js title="test.js"
function test(tp) {
  return tp.file.include("[[test-template]]");
}

module.exports = test;
```

```js title="template.md"
<% tp.user.test(tp) %>
```

## Daily note links to yesterday and tomorrow

We can pass in a format, offset, reference, and reference format to [tp.date.now](https://silentvoid13.github.io/Templater/internal-functions/internal-modules/date-module.html#tpdatenowformat-string--yyyy-mm-dd-offset-numberstring-reference-string-reference_format-string) to create links to yesterday and tomorrow relative to the active daily note, instead of being relative to the actual current date.

Though this does work, I personally prefer dynamic links using dataview, which I have documented [here](/snippets/dataview#get-links-to-previous-and-next-daily-notes).

```js title="daily-note-template.md"
[[<% tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD") %>|yesterday]]

[[<% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD") %>|tomorrow]]
```

## Update frontmatter

Instead of reading the contents of the file and parsing it manually, it's recommended to use `app.fileManager.processFrontMatter` from the Obsidian public api.

You must mutate the `frontmatter` object directly, do not try to copy the object first and then do mutations.

```js title="increment-template.md"
<%*
const file = tp.file.find_tfile(tp.file.title);
await app.fileManager.processFrontMatter(file, (frontmatter) => {
  frontmatter["review count"] += 1;
})
-%>
```

## Reuse value from prompt or suggester

Instead of prompting for the same value multiple times, you can prompt for it once, store it in a variable, and reference that variable multiple times.

Before:

```js
<%* await tp.system.prompt("Result") %>
<%* await tp.system.prompt("Result") %>
```

After:

```js
<%*
const result = await tp.system.prompt("Result")
_%>

<% result %>
<% result %>
```
