//gui elements
const DOM_Elements = {
	textarea: {
		source: document.getElementById("text"),
		lastValue: "",

		get value() {
			return this.source.value;
		},

		set value(value) {
			this.source.value = value;
			this.lastValue = value;
		},

		initializeWith(value) {
			this.source.value = value;
		},

		get wrap() {

			if (this.source.wrap === "on") {
				return true;
			}

			if (this.source.wrap === "off") {
				return false;
			}

		},

		set wrap(bool) {

			if (bool) {
				this.source.wrap = "on";
			}

			if (!bool) {
				this.source.wrap = "off";
			}

		},

		reset() {
			this.source.value = "";
		},

		hasChanged() {
			return this.source.value !== this.lastValue;
		}

	},

	titlesCheckbox: {
		source: document.getElementById("titles"),
		onEvent: null,

		get checked() {
			return this.source.checked;
		},

		set checked(bool) {
			this.source.checked = bool;
		},

		onClicked(onEvent) {
			this.onEvent = onEvent;
			this.source.addEventListener("click", this.onEvent);
		}
	},

	wrapCheckbox: {
		source: document.getElementById("wrap"),
		onEvent: null,

		get checked() {
			return this.source.checked;
		},

		set checked(bool) {
			this.source.checked = bool;
			this.onEvent();
		},

		onChecked(onEvent) {
			this.onEvent = onEvent
			this.source.addEventListener("click", this.onEvent);
		}
	}
}

//event listeners:

DOM_Elements.titlesCheckbox.onClicked(function(e) {
	//update text in textarea 

	//do not update textarea after it was changed
	if (DOM_Elements.textarea.hasChanged()) {
		return;
	}

	//get last dumped tabs
	let tabs = tabAgent.getLastTabs();
	
	//if no last dumped tabs exist, do not update textarea aswell
	//otherwise it will restet text
	if (tabs.length === 0) {
		return;
	}
	
	//update tabs print by changes to preferences
	let printConfig = {
		returnTitles: DOM_Elements.titlesCheckbox.checked
	}
	
	//print tabs to textarea
	DOM_Elements.textarea.value = textUtils.tabsToText(tabs, printConfig);

});

DOM_Elements.wrapCheckbox.onChecked(function(e) {

	//turn on/off text wrapping in textarea
	DOM_Elements.textarea.wrap = DOM_Elements.wrapCheckbox.checked;

});


//react to "reset" button being clicked
document.getElementById("reset_button").addEventListener("click", function(e) {

	DOM_Elements.textarea.reset();

});

//react to "get" button being clicked
document.getElementById("get_button").addEventListener("click", async function(e) {

	//get tabs from browser
	let tabs = await tabAgent.getTabs();

	//define how tabs should be printed in text
	let printConfig = {
		returnTitles: DOM_Elements.titlesCheckbox.checked
	}

	//print tabs to textarea
	DOM_Elements.textarea.value = textUtils.tabsToText(tabs, printConfig);

});

//react to "get_current" button being clicked
document.getElementById("get_current_button").addEventListener("click", async function(e) {
	
	//get current tab from browser
	let tab = await tabAgent.getCurrentTab();

	//define how tab should be printed in text
	let printConfig = {
		returnTitles: DOM_Elements.titlesCheckbox.checked
	}

	//print tab to textarea
	DOM_Elements.textarea.value = textUtils.tabsToText(tab, printConfig);

});

//react to "open" button being clicked
document.getElementById("set_button").addEventListener("click", async function(e) {

	//set tabs in browser
	let result = await tabAgent.setToExistingTabs(DOM_Elements.textarea);

	//if setting tabs operation was successful, clear textarea
	if (result.success) {
		DOM_Elements.textarea.reset();
	}

});

document.getElementById("set_new_button").addEventListener("click", async function(e) {
	
	//set tabs in browser
	let result = await tabAgent.setNewTabs(DOM_Elements.textarea);

	//if setting tabs operation was successful, clear textarea
	if (result.success) {
		DOM_Elements.textarea.reset();
	}


});

//get user prefs upon popup opening
window.addEventListener("load", async function(e) {
	//get user data from background
	let prefs = await userDataAgent.getData(DOM_Elements);

	//update DOM elements 
	DOM_Elements.textarea.initializeWith(prefs.input); //use initializeWith as it does not set "haschanged" to false
	DOM_Elements.wrapCheckbox.checked = prefs.wrap;
	DOM_Elements.titlesCheckbox.checked = prefs.titles;
});

//send current user prefs to the background (where it will be saved) upon popup close
window.addEventListener("pagehide", function(e) {

	//collect user data from DOM elements
	let prefs = {
		input: DOM_Elements.textarea.value,
		wrap: DOM_Elements.wrapCheckbox.checked,
		titles: DOM_Elements.titlesCheckbox.checked
	};

	//if text has not been changed since last dump, do not save it
	//as there is no point of doing it
	if (!DOM_Elements.textarea.hasChanged()) {
		prefs.input = "";
	}

	//set collected user data to storage
	//also no await for setData result as the page will be hided anyways
	userDataAgent.setData(prefs);

});