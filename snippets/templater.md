---
title: "Templater snippets"
createdAt: "2022-02-07"
description: "Snippets I've written for the Templater Obsidian plugin."
tags:
  - obsidianmd
  - javascript
---

Snippets I've written for the [Templater](https://github.com/SilentVoid13/Templater) Obsidian plugin.

## Create links to all weekly notes in current month

This script will create a list of links to all weekly notes that fall within the current month, using the current note as a reference. Assumes that the monthly note format of `YYYY-MM`.

```js
<%*
// Get year and month from note name, assumes format of "YYYY-MM"
const [year, month] = tp.file.title.split("-");

// Momentjs works with months starting at 0 index (January is month 0, February is month 1, etc)
// Subtract one to convert to starting at 0 index
const monthZeroIndex = month - 1;

// Get number of days in month
const monthDate = moment([year, monthZeroIndex]);
const daysInMonth = monthDate.daysInMonth();

// For each day in month
const weeks = [];
for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; ++dayOfMonth) {
  // Get week for day of month
  const week = moment([year, monthZeroIndex, dayOfMonth]).week();

  // If week is a new week, add to list of weeks for month
  if (!weeks.some(x => x === week)) {
    weeks.push(week);
  }
}

// Format weeks to be links, formatted at "[[YYYY-[W]WW]]"
const weeksFormatted = weeks.map(week => (
  `[[${year}-W${String(week).padStart(2, "0")}]]`
)).join("\n");
-%>

<% weeksFormatted %>
```

## Suggester for files with tag

This script will show a modal with a searchable list of files with a specific tag.

```js
<%*
const tag = "#example-tag";

const filteredFiles = app.vault.getMarkdownFiles().filter(file => {
  const tags = tp.obsidian.getAllTags(app.metadataCache.getFileCache(file));
  return tags.includes(tag);
});
const selectedFile = (await tp.system.suggester((file) => file.basename, filteredFiles)).basename;
-%>

[[<% selectedFile %>]]
```

## Suggester for tags

This script will show a modal with a searchable list of tags you can select from.

```js
<% tp.system.suggester(item => item, Object.keys(app.metadataCache.getTags())) %>
```

This variation will remove the `#` symbol from the tags, for use in YAML (since the `#` symbol denotes a comment and will not work in YAML).

```js
<% tp.system.suggester(item => item, Object.keys(app.metadataCache.getTags()).map(x => x.replace("#", ""))) %>
```

## Get most recently modified file with specific tag

This script will give you a link to the most recently modified file in your vault with a specific tag.

```js
<%*
// Set tag you want to get latest file for here
const tag = "#example-tag";

const latestTFileWithTag = app.vault.getMarkdownFiles().reduce((currLatestTFileWithTag, file) => {
  // Get all tags for file we're currently checking
  const tags = tp.obsidian.getAllTags(app.metadataCache.getFileCache(file));

  // If file has tag and if that file was modified more recently than the currently found most recently modified file, then set most recently modified file to file
  if (tags.includes(tag) && (!currLatestTFileWithTag || currLatestTFileWithTag.stat.mtime < file.stat.mtime)) {
    currLatestTFileWithTag = file;
  }
  return currLatestTFileWithTag;
}, null);

// Get basename of TFile to be used in link
const latestFileWithTag = latestTFileWithTag.basename;
-%>
[[<% latestFileWithTag %>]]
```

## Suggester for files in a specific folder

We use `app.vault.getMarkdownFiles()` to get all the markdown files in the vault, then `.filter()` them down to only files in a specific folder. Then use `tp.system.suggester` using those markdown files.

```js
<%*
const folder = "Folder Name";
const items = app.vault.getMarkdownFiles().filter(x => x.path.startsWith(folder));
const selectedItem = (await tp.system.suggester((item) => item.basename, items)).basename;
-%>

[[<% selectedItem %>]]
```

## Using tp.file.include in a user script

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

## Retrieve frontmatter from another note

Instead of reading the contents of the file and parsing it manually, it's recommended to use `app.metadataCache.getFileCache` from the Obsidian public api.

In this example, we can check a note for a field in frontmatter called `count` in another note, and if it exists, increment it and set it in the current note's frontmatter. Otherwise, fallback to setting it to "1".

```js title="get-count-template.md"
<%*
const file = tp.file.find_tfile("Note.md");
const fileCache = await app.metadataCache.getFileCache(file);

let count = 1;
if (fileCache?.frontmatter?.count) {
  count = fileCache.frontmatter.count + 1;
}
-%>
---
count: <% count %>
---
```

A common use case for this is to get frontmatter from another note in the same folder as your current folder and increment it. Here's an example of how to do that.

```js title="get-latest-count-in-folder-template.md"
<%*
// Setup fallback if no other files in folder
let count = 1;

// Get all files in current folder that aren't this file
const filesInFolder = app.vault.getMarkdownFiles().filter(
  x => x.parent?.path === tp.file.folder() && x.path !== tp.file.path(true)
);

if (filesInFolder.length > 0) {
  // Sort files by path descending and get latest file's cache
  filesInFolder.sort((a, b) => a.path < b.path ? 1 : -1);
  const latestTFile = filesInFolder[0];
  const fileCache = await app.metadataCache.getFileCache(latestTFile);

  // If latest file has count, increment it by 1 and use in new note's frontmatter
  if (fileCache?.frontmatter?.count) {
    count = fileCache.frontmatter.count + 1;
  }
}
-%>
---
count: <% count %>
---
```

## Update frontmatter

Instead of reading the contents of the file and parsing it manually, it's recommended to use `app.fileManager.processFrontMatter` from the Obsidian public api.

You must mutate the `frontmatter` object directly, do not try to copy the object first and then do mutations.

```js
<%*
const file = tp.file.find_tfile(tp.file.title);
await app.fileManager.processFrontMatter(file, (frontmatter) => {
  frontmatter["status"] = "In progress";
  frontmatter["review count"] += 1;
  delete frontmatter["ignored"];
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
