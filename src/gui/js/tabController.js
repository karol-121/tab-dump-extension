const tabController = {
	dumpedTabs: [],

	printTabs(tabs, target) {

		if (tabs) {
			this.dumpedTabs = tabs;
		}

		const printConfig = {
			returnTitles: target.titlesCheckbox.checked
		}

		const text = printUrls(this.dumpedTabs, printConfig);
		
		target.textarea.value = text;
	},

	getTabs() {
		//initiate a get-request for background worker
		browser.runtime.sendMessage({action: "get", status: "initiated"});
	},

	openTabs(source) {
		//check if current list/text does match with previous get, if so do not execute
		//otherwise it will be possible to repeatedly open the same set of tabs, get print list of tabs that is possible to open	
		if (!source.hasChanged()) {
			return;
		}

		const text = source.value;

		//get urls from user input
		const urls = extractUrls(text);

		//initiate a open-request for background worker
		browser.runtime.sendMessage({action: "open", status: "initiated", param: urls});
	},

	afterOpenedTabs(target) {
		target.textarea.reset();
	}

}