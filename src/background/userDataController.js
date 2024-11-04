//Buffer for user entered data, this is needed as GUI window does "forget" them when reopened
const userDataController = {
	lastWindowId: 0,
	
	//default data
	userData: {
		input: "",
		wrap: true,
		titles: true
	},

	async getData() {

		const currentWindow = await browser.windows.getCurrent();

		//if browser window has changed, clear input data
		if (this.lastWindowId != currentWindow.id) {
			this.userData.input = "";
			this.lastWindowId = currentWindow.id;
		}

		return this.userData;

	},

	setData(newUserData) {

		this.userData = newUserData;
		return Promise.resolve({success: true});
	
	}
}

