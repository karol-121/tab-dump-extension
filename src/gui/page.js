//defines actions that happens after open-request is fulfilled
function handleOpen() {
	//clean text-area after successful opening
	textarea.value = "";
}

//defines actions that happens after get-request is fulfilled
function handleGet(tabs) {
	
	//print configuration
	const printConfig = {
		returnTitles: returnTitles
	}

	//convert list of tabs into text
	const text = printUrls(tabs, printConfig);

	//show results to the user
	lastTextareaValue = text; //this value is used to check if changes were made to text-area since showing
	textarea.value = text;

}


//function that recieves and distributes user preferences from background
function handlePrefs(prefs) {
	lastTextareaValue = prefs.input;
	textarea.value = prefs.input;

}


//function that handles messages
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

const textarea = document.getElementById("text");
const wrapCheckbox = document.getElementById("wrap");
const titlesCheckbox = document.getElementById("titles");
let lastTextareaValue = "";
let returnTitles = false;

//handle communication with background script here.
//have to use messages as this is the only way to get communication with the background script in incognito mode
browser.runtime.onMessage.addListener(handleMessage);

//read user prefs from background
browser.runtime.sendMessage({action: "readPrefs", status: "initiated"});

//send current user prefs to the background (where it will be saved) upon popup close
window.addEventListener("pagehide", function(e) {

	//collect user preferences to be saved
	let prefs = {
		input: textarea.value
	};

	browser.runtime.sendMessage({action: "updatePrefs", status: "initiated", param: prefs});

});

//"wrap" checkbox has been clicked
wrapCheckbox.addEventListener("click", function(e) {
	if (wrapCheckbox.checked) {
		textarea.wrap = "on";
	} else {
		textarea.wrap = "off";
	}
});

//"return tab titles" checkbox has been clicked
titlesCheckbox.addEventListener("click", function(e) {
	returnTitles = titlesCheckbox.checked;
});

document.getElementById("reset_button").addEventListener("click", function(e) {
	textarea.value = "";
});

//"get" button has been clicked
document.getElementById("get_button").addEventListener("click", function(e) {
	//initiate a get-request for background worker
	browser.runtime.sendMessage({action: "get", status: "initiated"});
});

//"open" button has been clicked
document.getElementById("open_button").addEventListener("click", function(e) {
	//get text from textarea
	let textareaValue = textarea.value;

	//check if current list/text does match with previous get, if so do not execute
	//otherwise it will be possible to repeatedly open the same set of tabs, get print list of tabs that is possible to open	
	if (textareaValue != lastTextareaValue) {

		//get urls from user input
		const urls = extractUrls(textareaValue);

		//initiate a open-request for background worker
		browser.runtime.sendMessage({action: "open", status: "initiated", param: urls});
	}
});

