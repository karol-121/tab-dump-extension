const tabHandler = {

  openTabs(urls) {
    for (const url of urls) {
      browser.tabs.create({
        "url": url,
        "discarded": true
      });
    }

    browser.runtime.sendMessage({action: "open", status: "fulfilled"});
  },

  async getAllTabs() {

    const openedTabs = await browser.tabs.query({ currentWindow: true }); //gets list of current opened tabs
    const dumpedTabs = [];

    //strip uneeded information about the tabs
    for (const openedTab of openedTabs) {

      const dumpedTab = {
        url: openedTab.url,
        title: openedTab.title
      }
    
      dumpedTabs.push(dumpedTab);
    
    } 

    browser.runtime.sendMessage({action: "get", status: "fulfilled", param: dumpedTabs});
  }

}