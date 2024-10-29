//handle communication with background script here.
//have to use messages as this is the only way to get communication with the background script in incognito mode
browser.runtime.onMessage.addListener(handleMessage);

//function that handles message recieving 
//this is not optimal way of doing this, but it does work for now
function handleMessage(request, sender, response) {
  
  //care only about messages whose status is "fulfilled"
	if (request.status === "fulfilled") {

		if (request.action === "get") {
   		tabController.printTabs(request.param, DOM_Elements);
  	}

  	if (request.action === "open") {
   		tabController.afterOpenedTabs(DOM_Elements);
  	}

  	if (request.action === "readPrefs") {
  		userData.apply(request.param, DOM_Elements);
  	}
	}
}