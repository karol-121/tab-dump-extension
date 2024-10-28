//Buffer for user entered data, this is needed as GUI window does "forget" them when reopened
const userDataBuffer = {
	lastWindowId: 0,
	
	//default data
	userData: {
		input: "",
		wrap: true,
		titles: true
	},

	readUserData(windowId) {

		//if browser window has changed, clear input data
		if (this.lastWindowId != windowId) {
			this.userData.input = "";
			this.lastWindowId = windowId;
		}

		return this.userData;

	},

	setUserData(newUserData) {

		this.userData = newUserData
	
	}

}

