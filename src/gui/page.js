//defines actions that happens after open-request is fulfilled
function handleOpen() {
	//clean text-area after successful opening
	textarea.value = "";
}

//defines actions that happens after get-request is fulfilled
function handleGet(tabs) {
	
	//print configuration
	const printConfig = {
		returnTitles: titlesCheckbox.checked
	}

	//convert list of tabs into text
	const text = printUrls(tabs, printConfig);

	//show results to the user
	textarea.value = text;

}

//function that recieves and distributes user preferences from background
function handlePrefs(prefs) {

	//set saved state to gui elements
	textarea.value = prefs.input;
	wrapCheckbox.checked = prefs.wrap;
	titlesCheckbox.checked = prefs.titles;

}

//function that handles message recieving 
//this is not optimal way of doing this, but it does work for now
function handleMessage(request, sender, response) {
  
  //care only about messages whose status is "fulfilled"
	if (request.status === "fulfilled") {

		if (request.action === "get") {
   		handleGet(request.param);
  	}

  	if (request.action === "open") {
   		handleOpen();
  	}

  	if (request.action === "readPrefs") {
  		handlePrefs(request.param);
  	}
	}
}


//entry point
//this is where script starts executing from

//gui elements

//textarea
const textarea = {
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

	hasChanged() {
		return this.source.value !== this.lastValue;
	}

}

//checkbox for returning titles
const titlesCheckbox  = {
	source: document.getElementById("titles"),

	get checked() {
		return this.source.checked;
	},

	set checked(bool) {
		this.source.checked = bool;
	}

}

//checkbox for textarea wrap
const wrapCheckbox  = {
	source: document.getElementById("wrap"),
	onEvent: null,

	get checked() {
		return this.source.checked;
	},

	set checked(bool) {
		this.source.checked = bool;
		this.onEvent();
	},

	registerEventListener() {
		this.source.addEventListener("click", this.onEvent);
	}

}

//subscriber that react to toggling of wrap checkbox
function toggleWrapCheckbox() {
	textarea.wrap = wrapCheckbox.checked;
}

//arm wrap checkbox event listener
wrapCheckbox.onEvent = toggleWrapCheckbox;
wrapCheckbox.registerEventListener();


//handle communication with background script here.
//have to use messages as this is the only way to get communication with the background script in incognito mode
browser.runtime.onMessage.addListener(handleMessage);

//send current user prefs to the background (where it will be saved) upon popup close
window.addEventListener("pagehide", function(e) {

	//collect user preferences to be saved
	let prefs = {
		input: textarea.value,
		wrap: wrapCheckbox.checked,
		titles: titlesCheckbox.checked
	};

	browser.runtime.sendMessage({action: "updatePrefs", status: "initiated", param: prefs});

});

//read user prefs from background
browser.runtime.sendMessage({action: "readPrefs", status: "initiated"});


//react to "reset" button being clicked
document.getElementById("reset_button").addEventListener("click", function(e) {
	textarea.value = "";
});

//react to "get" button being clicked
document.getElementById("get_button").addEventListener("click", function(e) {
	//initiate a get-request for background worker
	browser.runtime.sendMessage({action: "get", status: "initiated"});
});

//react to "open" button being clicked
document.getElementById("open_button").addEventListener("click", function(e) {

	//check if current list/text does match with previous get, if so do not execute
	//otherwise it will be possible to repeatedly open the same set of tabs, get print list of tabs that is possible to open	
	if (textarea.hasChanged()) {

		let textareaValue = textarea.value;

		//get urls from user input
		const urls = extractUrls(textareaValue);

		//initiate a open-request for background worker
		browser.runtime.sendMessage({action: "open", status: "initiated", param: urls});
	}
});

