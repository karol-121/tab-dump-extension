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

//read user prefs from background
userDataAgent.getData(DOM_Elements);

//event listeners:

DOM_Elements.titlesCheckbox.onClicked(function(e) {
	tabAgent.printTabs(DOM_Elements);
});

DOM_Elements.wrapCheckbox.onChecked(function(e) {
	DOM_Elements.textarea.wrap = DOM_Elements.wrapCheckbox.checked;
});

//send current user prefs to the background (where it will be saved) upon popup close
window.addEventListener("pagehide", function(e) {
	userDataAgent.setData(DOM_Elements);
});

//react to "reset" button being clicked
document.getElementById("reset_button").addEventListener("click", function(e) {
	DOM_Elements.textarea.reset();
});

//react to "get" button being clicked
document.getElementById("get_button").addEventListener("click", function(e) {
	tabAgent.getTabs(DOM_Elements);
});

//react to "open" button being clicked
document.getElementById("open_button").addEventListener("click", function(e) {
	tabAgent.setTabs(DOM_Elements.textarea);
});