---
title: "Click all unchecked checkboxes"
createdAt: "2022-04-25"
description: "Click on all unchecked checkboxes in the document."
tags:
  - javascript
---

Click on all unchecked checkboxes in the document.

```js
document
  .querySelectorAll("input[type=checkbox]:not(:checked)")
  .forEach((el) => el.click());
```
