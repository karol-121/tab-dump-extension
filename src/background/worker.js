//handle communication here, have to use it as this is the only way to get communication with the background script in incognito mode
browser.runtime.onMessage.addListener(handleMessage);

//object that collect user preferences, here default values are defined
let userPref = {
  input: ""
};

function updateUserPref(prefs) {
  userPref = prefs
  //here this function can not call back page (popup) script as at this time it is closed
}

function readUserPref() {
  browser.runtime.sendMessage({action: "readPrefs", status: "fulfilled", param: userPref});
}




function handleMessage(request, sender, response) {
  
  //care only about messages whose status is "initiated"
  if (request.status === "initiated") {

    if (request.action === "get") {
      get(request);
    }

    if (request.action === "open") {
      open(request.param);
    }

    if (request.action === "updatePrefs") {
      updateUserPref(request.param);
    }

    if (request.action === "readPrefs") {
      readUserPref();
    }
  }

}


//function that creates tab for each url found in urls array
function open(urls) {
  for (const url of urls) {
    browser.tabs.create({
      "url": url,
      "discarded": true
    });
  }

  browser.runtime.sendMessage({action: "open", status: "fulfilled"})
}


//function that return array of urls of all tabs in current window
async function get() {

  const openedTabs = await browser.tabs.query({ currentWindow: true }); //gets list of current opened tabs
  const dumpedTabs = []; //array where information about tabs will be send to the user

  //strip uneeded information about the tabs
  for (const openedTab of openedTabs) {

    const dumpedTab = {
      url: openedTab.url,
      title: openedTab.title
    }
    
    dumpedTabs.push(dumpedTab);
    
  } 

  browser.runtime.sendMessage({action: "get", status: "fulfilled", param: dumpedTabs});
}