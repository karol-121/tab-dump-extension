const tabController = {

  setTabs(urls) {
    for (const url of urls) {
      browser.tabs.create({
        "url": url,
        "discarded": true
      });
    }

    return Promise.resolve({success: true});
  },

  async getTabs() {

    const openedTabs = await browser.tabs.query({ currentWindow: true });
    const dumpedTabs = [];

    //strip uneeded information about the tabs
    for (const openedTab of openedTabs) {

      const dumpedTab = {
        url: openedTab.url,
        title: openedTab.title
      }
    
      dumpedTabs.push(dumpedTab);
    
    } 

    return dumpedTabs;
  }

}