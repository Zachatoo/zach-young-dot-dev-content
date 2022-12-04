---
title: "Templater snippets"
createdAt: "2022-02-07"
description: "Snippets I've written for the Templater Obsidian plugin."
tags:
  - obsidian
---

Snippets I've written for the [Templater](https://github.com/SilentVoid13/Templater) Obsidian plugin.

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
