//handle communication here, have to use it as this is the only way to get communication with the background script in incognito mode
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

document.getElementById("get_button").addEventListener("click", function(e) {

	//stuff to do before initiating get-request

	//initiate a get-request for background worker
	browser.runtime.sendMessage({action: "get", status: "initiated"});

});

document.getElementById("open_button").addEventListener("click", function(e) {

	let textareaValue = textarea.value;

	//check if current list/text does match with previous get, if so do not execute
	//otherwise it will be possible to repeatedly open the same set of tabs, get print list of tabs that is possible to open	
	if (textareaValue != lastTextareaValue) {
		
		const regexUrl = /\S{3,}/gm;
		const urls = new Array();
		
		let tempArray;
		
		while ((tempArray = regexUrl.exec(textareaValue)) !== null) {
  		
  		//extract only match from exec function
  		urls.push(tempArray[0]);

		}

		//initiate a open-request for background worker
		browser.runtime.sendMessage({action: "open", status: "initiated", param: urls});

	}

});


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

