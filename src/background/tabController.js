const tabController = {

  //Append new tabs to existing ones
  setToExistingTabs(urls) {

    for (const url of urls) {
      browser.tabs.create({
        "url": url,
        "discarded": true
      });
    }

    return Promise.resolve({ success: true });

  },

  //Overwrite current tabs with new ones
  async setNewTabs(urls) {

    //if there is no urls to be set, exit early
    if (urls.length === 0) {
      return Promise.resolve({ success: false });
    }

    //save initial tab set
    const intialTabSet = await browser.tabs.query({ currentWindow:true });

    for (const url of urls) {
      browser.tabs.create({
        "url": url,
        "discarded": true
      });
    }

    //close all initial tabs
    for (const intitalTab of intialTabSet) {
      browser.tabs.remove(intitalTab.id);
    }

    return Promise.resolve({ success: true });

  },

  async getTabs() {

    const openedTabs = await browser.tabs.query({ currentWindow: true });
    return this.formatTabs(openedTabs);
    
  },

  async getCurrentTab() {

    const currentTab = await browser.tabs.query({ currentWindow: true, active: true });
    return this.formatTabs(currentTab);

  },

  formatTabs(tabs) {
    const formattedTabs = [];

    //strip unnecessary attributes
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