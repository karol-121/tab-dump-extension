//handle communication here, have to use it as this is the only way to get communication with the background script in incognito mode
browser.runtime.onMessage.addListener(handleMessage);


//function that handles message recieving 
function handleMessage(request, sender, response) {

    if (request.action === "getTabs") {
      return tabController.getTabs();
    }

    if (request.action === "getCurrentTab") {
      return tabController.getCurrentTab();
    }

    if (request.action === "setToExistingTabs") {
      return tabController.setToExistingTabs(request.param);
    }

    if (request.action === "setNewTabs") {
      return tabController.setNewTabs(request.param);
    }

    if (request.action === "getUserData") {
      return userDataController.getData();
    }

    if (request.action === "setUserData") {
      return userDataController.setData(request.param);
    }

}