const tabAgent = {
	dumpedTabs: [],

	async getTabs(target) {

		let tabs = await browser.runtime.sendMessage({action: "getTabs"});

		//save current tabs for later use (i.e printTabs())
		this.dumpedTabs = tabs;
		this.printTabs(target);
		
	},

	printTabs(target) {

		console.log(this.dumpedTabs);
		//if no dumped tabs is saved, do not proceed as it will clear textarea
		if (this.dumpedTabs.length === 0) {
			return;
		}

		const printConfig = {
			returnTitles: target.titlesCheckbox.checked
		}

		const text = printUrls(this.dumpedTabs, printConfig);
		target.textarea.value = text;
	},

	async setTabs(source) {
		//check if current list/text does match with previous get, if so do not execute
		//otherwise it will be possible to repeatedly open the same set of tabs, get print list of tabs that is possible to open	
		if (!source.hasChanged()) {
			return;
		}

		const text = source.value;
		const urls = extractUrls(text);

		let action = await browser.runtime.sendMessage({action: "setTabs", param: urls});		
		
		//clear textarea after successfull tabs opening
		if (action.success) {
			source.reset();
		}
	}

}