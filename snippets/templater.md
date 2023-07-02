---
title: "Templater snippets"
createdAt: "2022-02-07"
description: "Snippets I've written for the Templater Obsidian plugin."
tags:
  - obsidianmd
  - javascript
---

Snippets I've written for the [Templater](https://github.com/SilentVoid13/Templater) Obsidian plugin.

## Create file if it doesn't exist

This script will create a file if the file doesn't already exist.

```js title="create-if-not-exists.md"
<%*
const fileName = "This is the name of a file";
const existing = tp.file.find_tfile(fileName);
if (!existing) {
  await tp.file.create_new("Contents", fileName);
}
_%>
```

Here's how you can create an internal link in a template that will create a new file only if it doesn't already exist.

```js title="create-if-not-exists-with-link.md"
<%*
const fileName = "This is the name of a file";
const existing = tp.file.find_tfile(fileName);
let createdFileDisplay;
if (existing) {
  createdFileDisplay = existing.basename;
} else {
  createdFileDisplay = (await tp.file.create_new("Contents", fileName)).basename;
}
_%>

// Somewhere later in the file
[[<% createdFileDisplay %>]]
```

Here's a script that will create an internal link in a template that will create a new file using a template if it doesn't already exist.

```js title="create-if-not-exists-with-link-and-template.md"
<%*
const fileName = "This is the name of a file";
const existing = tp.file.find_tfile(fileName);
let createdFileDisplay;
if (existing) {
  createdFileDisplay = existing.basename;
} else {
  createdFileDisplay = (await tp.file.create_new(tp.file.find_tfile("template-name"), fileName)).basename;
}
_%>

// Somewhere later in the file
[[<% createdFileDisplay %>]]
```

## Reapply template instead of append

Place this script at the top of your template to clear out the file first before applying the rest of your template.

This is useful if you want to "reapply" a template to a file rather than append to it.

```js
<%*
await app.vault.modify(tp.file.find_tfile(tp.file.title), "");
_%>
// Rest of template below
```

## Create links to all files created today

This script will create a list of all files created today, based on a field in your notes frontmatter. This could be modified to use `cday`, but I've found that to not be accurate, especially when syncing files between devices, so I prefer to store the created/modified dates of notes in frontmatter of the note.

You can swap out the `createdOn` in `fileCache?.frontmatter?.createdOn` with whatever field you want put in your frontmatter to track the created date. You can also change `YYYY-MM-DD` to match the date format you put for the value of your created date field.

```js title="get-files-created-today.md"
<%*
const today = tp.date.now("YYYY-MM-DD");
// Loop through all files
const mappedFilePromises = app.vault.getMarkdownFiles().map(async file => {
  const fileCache = await app.metadataCache.getFileCache(file);
  // If the file has a createdOn field and it's value is today, mark it to be included
  file.shouldInclude = fileCache?.frontmatter?.createdOn === today;
  return file;
});
// Wait for all files to be processed (have to wait because getting frontmatter is asynchronous)
const mappedFiles = await Promise.all(mappedFilePromises);
// Filter out files that shouldn't be included
const filteredFiles = mappedFiles.filter(file => file.shouldInclude);
// Convert list of files into list of links
const links = filteredFiles.map(file => `[[${file.basename}]]`).join("\n");
tR += links;
_%>
```

## Opening files in new tabs

This script will open multiple tabs of notes. You can do repeat these two lines of code as much as you'd like.

```js title="open-two-files-in-new-tabs.md"
<%*
const note1 = tp.file.find_tfile("filename1");
app.workspace.getLeaf(true).openFile(note1);

const note2 = tp.file.find_tfile("filename2");
app.workspace.getLeaf(true).openFile(note2);
-%>
```

This script will open multiple tabs and create notes with templates applied to them. For the last tab we don't need to explicitly open the tab.

```js title="create-and-open-three-files-in-new-tabs.md"
<%*
const template1 = tp.file.find_tfile("template-1");
await tp.file.create_new(template1, "filename1", true);
const note1 = tp.file.find_tfile("filename1");
app.workspace.getLeaf(true).openFile(note1);

const template2 = tp.file.find_tfile("template-2");
await tp.file.create_new(template2, "filename2", true);
const note2 = tp.file.find_tfile("filename2");
app.workspace.getLeaf(true).openFile(note2);

const template3 = tp.file.find_tfile("template-3");
await tp.file.create_new(template3, "filename3", true);
-%>
```

## Create links to all weekly notes in current month

This script will create a list of links to all weekly notes that fall within the current month, using the current note as a reference. Assumes that the monthly note format of `YYYY-MM` and a weekly note format of `YYYY-[W]ww`.

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

## Create links to all daily notes in week

This script will create a list of links to all daily notes that fall within the current week, using the current note as a reference. Assumes that the weekly note format of `YYYY-[W]ww` and a daily note format of `YYYY-MM-DD`.

```js
[[<% tp.date.weekday("YYYY-MM-DD", 0, tp.file.title, "YYYY-[W]ww") %>]]
[[<% tp.date.weekday("YYYY-MM-DD", 1, tp.file.title, "YYYY-[W]ww") %>]]
[[<% tp.date.weekday("YYYY-MM-DD", 2, tp.file.title, "YYYY-[W]ww") %>]]
[[<% tp.date.weekday("YYYY-MM-DD", 3, tp.file.title, "YYYY-[W]ww") %>]]
[[<% tp.date.weekday("YYYY-MM-DD", 4, tp.file.title, "YYYY-[W]ww") %>]]
[[<% tp.date.weekday("YYYY-MM-DD", 5, tp.file.title, "YYYY-[W]ww") %>]]
[[<% tp.date.weekday("YYYY-MM-DD", 6, tp.file.title, "YYYY-[W]ww") %>]]
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

## Suggester for subfolders in a specific folder

We use `app.vault.getAbstractFileByPath()` to get a `TAbstractFile` folder object, then show a prompt to the user for subfolders in that folder. If there are no subfolders or if no subfolder is selected, then prompt for a new subfolder to be created. Then move the current file to the subfolder.

```js title="move-file-to-subfolder.md"
<%*
// Get details about folder (change "Work/Meetings" to desired folder)
const meetingsFolder = "Work/Meetings";
const meetingsTFolder = app.vault.getAbstractFileByPath(meetingsFolder);
const companies = meetingsTFolder.children.filter(subfolder => subfolder instanceof tp.obsidian.TFolder);
let selectedCompany;

// Prompt user to select company if there are any companies
if (companies.length > 0) {
  selectedCompany = (await tp.system.suggester((company) => company.name, companies))?.name;
}

// If no company selected or no companies to select from, prompt for new company
if (!selectedCompany) {
  selectedCompany = await tp.system.prompt("New company");
}

// Move file to company folder, creating the company folder if needed
await tp.file.move(`${meetingsFolder}/${selectedCompany}/${tp.file.title}`);
-%>
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
