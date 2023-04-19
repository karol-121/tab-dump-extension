//functions that extract url values from user input
function extractUrls(text) {
	const matchComments = /^#.+/gm //matches strings that starts with "#"
	const matchUrls = /\S+/gm //matches text blocks separated with white space 
	const startWithProtocol = /^\S{1,5}:\/\/\S*/; //match values that begins with protocol
	const defaultProtocol = "https://"; //protocol to append if link does not contain such

	const urls = new Array();

	let urlsTemp = text;

	//removing lines that starts with "#" as those are comments 
	urlsTemp = urlsTemp.replaceAll(matchComments, "");

	//creating match with everything but white spaces
	const urlMatches = urlsTemp.matchAll(matchUrls);

	//retrieving urls from matches
	for (const urlMatch of urlMatches) {

		let url = urlMatch[0];

		//add default protocol to link if missing, otherwise browser will fail to open this url
		if(!startWithProtocol.test(url)) {
			url = defaultProtocol + url; 
		}

		urls.push(url);
	}

	return urls;
}

//defines actions that happens after open-request is fulfilled
function handleOpen() {
	textarea.value = "";
}

//defines actions that happens after get-request is fulfilled
function handleGet(tabs) {
	//print all urls, each in new line to textarea:
	let text = "";

	for (const tab of tabs) {
		
		if (returnTitles) {
			let string = "#" + tab.title + '\n';
			text += string;
		}

		let string =  tab.url + '\n\n';
		text += string;
	}

	lastTextareaValue = text;
	textarea.value = text;
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

