//handle communication with background script here.
//have to use messages as this is the only way to get communication with the background script in incognito mode
browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, response) {
  
  //care only about messages whose status is "fulfilled"
	if (request.status === "fulfilled") {

		if (request.action === "get") {
   		handle_get(request.param);
  	}

  	if (request.action === "open") {
   		handle_open();
  	}

	}
}

const textarea = document.getElementById("text");
let lastTextareaValue = "";

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

		//retrive valid urls from text
		const urls = new Array();
		const values = textareaValue.split(/\s/gm);

		for (value of values) {

			let url = fixUrl(value);
			urls.push(url);

		}

		//initiate a open-request for background worker
		browser.runtime.sendMessage({action: "open", status: "initiated", param: urls});

	}

});

//function that fixes urls (making them valid)
function fixUrl(value) {
	const startWithProtocol = /\S{1,5}:\/\/\S*/gm; //match values that begins with protocol
	const defaultProtocol = "https://"; //protocol to append if link does not contain such

	//if value (link) is shorter than 5 chars, return as it is not valid link
	if(value.length < 5) {
		return;
	}

	//if value (link) does not start with protocol
	if(!startWithProtocol.test(value)) {
		value = defaultProtocol + value; //add default protocol to link, otherwise browser will treat it as local link
	}

	return value;

}


//defines actions that happens after open-request is fulfilled 
function handle_open() {
	textarea.value = "";
}

//defines actions that happens after get-request is fulfilled
function handle_get(urls) {

	//print all urls, each in new line to textarea:
	let text = "";

	for (const url of urls) {
		let string = url + '\n';
		text += string;
	}

	lastTextareaValue = text;
	textarea.value = text;

}

