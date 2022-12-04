---
title: "Dataview snippets"
createdAt: "2022-10-21"
description: "Snippets I've written for the Dataview Obsidian plugin."
---

## Get days since note was created.

DataviewJS query:

```js
$ = moment().diff(moment(dv.current().file.cday.toString()), "days");
```

## Get notes that have any matching interests.

[Link to request](https://discord.com/channels/686053708261228577/1014259487445622855/1044041213797470259)

Sample frontmatter:

```md
---
interests:
  - sports
  - cooking
---
```

Dataview query:

```js
TABLE interests
FROM "People"
WHERE any(filter(interests, (x) => contains(this.interests, x)))
```

## Get notes that have any matching interests and _only return matching interests_.

[Link to request](https://discord.com/channels/686053708261228577/1014259487445622855/1044132452173623328)

Sample frontmatter:

```md
---
interests:
  - sports
  - cooking
---
```

Dataview query:

```js
TABLE filter(interests, (x) => contains(this.interests, x)) as "interests"
FROM "People"
WHERE any(filter(interests, (x) => contains(this.interests, x)))
```

## Get links to previous and next daily notes

This is a modified script from deezy in the [Obsidian Discord](https://discord.com/channels/686053708261228577/694233507500916796/1046646558659182614).

Dataview view:

```js
// Get list of notes ordered alphanumerically.
const pages = dv.pages(input.source).sort((page) => page.file.path);

// Get index of current page in list of pages.
const currPageIndex = pages.findIndex(
  (page) => page.file.path === dv.current().file.path
);

// Create links to previous and next notes. If no previous/next note, use a fallback.
const getLinkSafe = (page, fallback) => page?.file?.link || fallback;
const prevLink = getLinkSafe(pages[currPageIndex - 1], "Earliest Entry");
const nextLink = getLinkSafe(pages[currPageIndex + 1], "Latest Entry");

dv.header(6, `<< ${prevLink} | ${nextLink} >>`);
```

Sample usage:

````md
```dataviewjs
dv.view("00 Meta/03 Dataview Views/sequential-links", { source: '"Daily Notes"' })
```
````
