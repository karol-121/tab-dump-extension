const userDataAgent = {

	async getData(target) {

		let prefs = await browser.runtime.sendMessage({action: "getUserData"});

		target.textarea.value = prefs.input;
		target.wrapCheckbox.checked = prefs.wrap;
		target.titlesCheckbox.checked = prefs.titles;
	},

	async setData(source) {

		let prefs = {
			input: source.textarea.value,
			wrap: source.wrapCheckbox.checked,
			titles: source.titlesCheckbox.checked
		};

		browser.runtime.sendMessage({action: "setUserData", param: prefs});
	}

}