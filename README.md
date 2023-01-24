# ![logo](src/icons/icon-48.png) Tab dump extension

Simple yet powerful browser extension for Firefox that let user dump and open tabs from text.
Extension can be used in many different user scenarios thanks to universal text format.

## Overview

Extension implements a simple GUI where the user can either enter or retrieve list of tabs. The GUI consist of two buttons; Dump-button and Open-button and one text area where data is either returned or entered. Clicking on "Dump tabs" button in GUI will return list of tabs in current window to text area. Clicking on "Open tabs" in GUI will open each entered URL in text area as a separate tab.

Additionally there is possibility to toggle between wrap/no wrap for links in the list. This may become useful when displaying one link per line is needed.
There is also possibility to clear list for easier usage.

![screenshot of extension's Gui](assets/screenshot-1.jpg)

*Extension's GUI*

![screenshot of extension's Gui](assets/screenshot-2.jpg)

*List of dumped tabs*

In addition all tabs are opened in "discarded" mode, which means that theirs content is not loaded until they become active. This approach allows to save resources while loading big set of tabs.

## Installation:
Available for Firefox via: https://addons.mozilla.org/firefox/addon/tab-dump/

In addition you also install it as local debug install. **Note that you will have to install it every time you open the browser**
- [Installing extension locally](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)

## Bugs & To do
See issues on this repo

