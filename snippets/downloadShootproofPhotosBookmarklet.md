---
title: "Download Shootproof photos bookmarklet"
createdAt: "2022-10-21"
description: "This bookmarklet is to download all of the photos from a Shootproof gallery. It'll go through each photo one by one and download the high quality image."
tags:
  - javascript
---

This bookmarklet is to download all of the photos from a Shootproof gallery. It'll go through each photo one by one and download the high quality image.

## Instructions

1. Navigate to your shootproof gallery. The url should be something like https://photographer.shootproof.com/gallery/12345678/home
2. Click on the first photo in the gallery. The url should now be something like https://photographer.shootproof.com/gallery/12345678/photo/1234567890
3. Copy the [code](#code) at the bottom of this page.
4. Add a new bookmark to your bookmarks bar. This is usually done by right clicking somewhere on the bookmarks bar and then clicking "Add Bookmark".
5. Name the bookmark whatever you want.
6. Paste what you copied from step 3 into the url for the bookmark.
7. Save the bookmark.
8. Click on the bookmark to run the script.

## Code

```js
javascript: (function () {
  const NEXT_BTN_CLASS = "photo-navigation-link-next";
  const DOWNLOAD_BTN_CLASS = "photo-action-download";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function clickButton(className) {
    document.getElementsByClassName(className)[0].click();
  }

  function isButtonClickable(className) {
    const button = document.getElementsByClassName(className)[0];
    return !button.classList.contains("disabled");
  }

  async function run() {
    while (true) {
      clickButton(DOWNLOAD_BTN_CLASS);
      await sleep(2500);
      if (!isButtonClickable(NEXT_BTN_CLASS)) {
        break;
      }
      clickButton(NEXT_BTN_CLASS);
      await sleep(1000);
    }
  }
  run();
})();
```
