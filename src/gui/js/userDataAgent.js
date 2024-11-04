const userDataAgent = {

	setData(source) {
		let prefs = {
			input: source.textarea.value,
			wrap: source.wrapCheckbox.checked,
			titles: source.titlesCheckbox.checked
		};

		browser.runtime.sendMessage({action: "updatePrefs", status: "initiated", param: prefs});
	},

	printData(prefs, target) {

		target.textarea.value = prefs.input;
		target.wrapCheckbox.checked = prefs.wrap;
		target.titlesCheckbox.checked = prefs.titles;
	},

	getData() {
		browser.runtime.sendMessage({action: "readPrefs", status: "initiated"});
	}

}