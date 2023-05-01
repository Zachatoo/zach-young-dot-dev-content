---
title: "Obsidian quick capture for Android"
createdAt: "2023-02-22"
updated at: "2023-05-01"
description: "How to add a widget to your homescreen to quickly send data to your vault, without opening Obsidian."
tags:
  - obsidianmd
---

My Android phone takes a while to load the Obsidian app, so I added a widget to my homescreen to quickly capture information to my vault to process later on my computer.

There's a few tools we can use on Android to create a widget. [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm) and [Automate](https://play.google.com/store/apps/details?id=com.llamalab.automate) are fairly popular options that also provide ways to do various automations on your device. I use Automate because of it's free tier, though I did eventually purchase the paid version. The paid version is _not_ required for this to work.

## Installing Automate and the flow

1. Download the Automate app [here](https://play.google.com/store/apps/details?id=com.llamalab.automate).
1. Open the community flow store.
   - You can do this either by tapping on the "More flows..." flow in the main screen, or by opening the left sidebar and tapping "Community".
1. Tap the search icon and search for "Obsidian".
1. Find the flow titled "Quick Capture for Obsidian" by "Zach Young" and download it.

## Automate widget

Here are the steps to add a widget to your homescreen that will provide a way to quick capture information to a specific note in your vault.

1. Open the Automate app, or go to the main screen if it's already open.
1. Tap on the "Quick Capture for Obsidian" flow that you downloaded from the community flow store.
1. Tap the pencil icon button to edit the flow.
1. Find and tap on block 22.
1. Tap on the input box for "File" and find and select which file you want to send your quick captures to.
1. (Optional) Update the "Content" inbox box to match the format you want. Put the text that says `{text}` where you want your quick captured text to be in relation to the rest of the content that will be added to your note.
1. Tap save to go back to the edit flow screen.
1. Find and tap on block 26.
1. Tap on "Install Home Screen Shortcut" and add the widget to your homescreen.

You should now have a widget on your homescreen. When you tap on the widget, you should see an input box that you can quickly jot down a note in and tap "OK" to save it to your note you choose earlier.

## Automate selection capture

We can also be able to select text (by holding down on some text) and send the text to Obsidian.

1. Open the Automate app, or go to the main screen if it's already open.
1. Tap on the "Quick Capture for Obsidian" flow that you downloaded from the community flow store.
1. Tap on "Start", then "Quick Capture Selected Text".

Now whenever you select some text, the popup that shows up asking if you want to copy, search, select, etc will also have an option for "Automate flow". Tap on that, then "Add to Obsidian" to add the selected text to your note.

## Obsidian inbox plugin

I created a plugin for Obsidian called "Inbox" that will notify you when there's new information to process in your note that you're sending quick captures to. You can install it [here](obsidian://show-plugin?id=inbox). The plugin includes a walkthrough that will help you setup the settings properly.
