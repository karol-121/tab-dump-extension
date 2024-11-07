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
    return this.formatTabs(openedTabs);
    
  },

  async getCurrentTab() {

    const currentTab = await browser.tabs.query({currentWindow: true, active: true});
    return this.formatTabs(currentTab);

  },

  formatTabs(tabs) {
    const formattedTabs = [];

    //strip uneeded information about the tabs
    for (const tab of tabs) {

      const formattedTab = {
        url: tab.url,
        title: tab.title
      }
    
      formattedTabs.push(formattedTab);
    
    } 

    return formattedTabs;

  }

}