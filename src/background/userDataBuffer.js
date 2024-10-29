//Buffer for user entered data, this is needed as GUI window does "forget" them when reopened
const userDataBuffer = {
	lastWindowId: 0,
	
	//default data
	userData: {
		input: "",
		wrap: true,
		titles: true
	},

	async readUserData() {

		const currentWindow = await browser.windows.getCurrent();

		//if browser window has changed, clear input data
		if (this.lastWindowId != currentWindow.id) {
			this.userData.input = "";
			this.lastWindowId = currentWindow.id;
		}

		browser.runtime.sendMessage({action: "readPrefs", status: "fulfilled", param: this.userData});

	},

	setUserData(newUserData) {

		this.userData = newUserData
	
	}
}

