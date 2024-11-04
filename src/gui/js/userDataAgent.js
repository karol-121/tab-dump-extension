const userDataAgent = {

	async getData() {

		let prefs = await browser.runtime.sendMessage({action: "getUserData"});
		return prefs;
		
	},

	async setData(prefs) {

		let action = await browser.runtime.sendMessage({action: "setUserData", param: prefs});
		return action;
	}

}