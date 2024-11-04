const tabAgent = {
	lastTabs: [],

	async getTabs(target) {

		let tabs = await browser.runtime.sendMessage({action: "getTabs"});

		//save current tabs for later use (i.e printTabs())
		this.lastTabs = tabs;
		
		return this.lastTabs;
		
	},

	getLastTabs() {
		return this.lastTabs;
	},

	async setTabs(source) {
		//check if current list/text does match with previous get, if so do not execute
		//otherwise it will be possible to repeatedly open the same set of tabs, get print list of tabs that is possible to open	
		if (!source.hasChanged()) {
			return;
		}

		const text = source.value;
		const urls = textUtils.textToUrls(text);

		let action = await browser.runtime.sendMessage({action: "setTabs", param: urls});
		return action;
	}

}