const tabAgent = {
	lastTabs: [],

	async getTabs() {

		let tabs = await browser.runtime.sendMessage({action: "getTabs"});

		//save current tabs for later use (i.e printTabs())
		this.lastTabs = tabs;
		
		return this.lastTabs;
		
	},

	async getCurrentTab() {
		
		let tab = await browser.runtime.sendMessage({action: "getCurrentTab"});

		//update lastTabs with current fetch
		this.lastTabs = tab;

		return this.lastTabs;
	},

	getLastTabs() {
		return this.lastTabs;
	},

	async setToExistingTabs(source) {
		//check if current list/text does match with previous get, if so do not execute
		//otherwise it will be possible to repeatedly open the same set of tabs, get print list of tabs that is possible to open	
		if (!source.hasChanged()) {
			return;
		}

		const text = source.value;
		const urls = textUtils.textToUrls(text);

		let action = await browser.runtime.sendMessage({action: "setToExistingTabs", param: urls});
		return action;
	},

	async setNewTabs(source) {
		//check if current list/text does match with previous get, if so do not execute
		//otherwise it will be possible to repeatedly open the same set of tabs, get print list of tabs that is possible to open	
		if (!source.hasChanged()) {
			return;
		}

		const text = source.value;
		const urls = textUtils.textToUrls(text);

		let action = await browser.runtime.sendMessage({action: "setNewTabs", param: urls});
		return action;
	}

}