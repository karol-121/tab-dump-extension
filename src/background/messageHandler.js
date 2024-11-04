//handle communication here, have to use it as this is the only way to get communication with the background script in incognito mode
browser.runtime.onMessage.addListener(handleMessage);


//function that handles message recieving 
//this is not optimal way of doing this, but it does work for now
function handleMessage(request, sender, response) {

  
  //care only about messages whose status is "initiated"
  if (request.status === "initiated") {

    if (request.action === "get") {
      tabController.getTabs();
    }

    if (request.action === "open") {
      tabController.setTabs(request.param);
    }

    if (request.action === "updatePrefs") {
      userDataController.setData(request.param);
    }

    if (request.action === "readPrefs") {
      userDataController.getData();
    }
  }

}