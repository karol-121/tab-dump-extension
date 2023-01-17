//handle communication here, have to use it as this is the only way to get communication with the background script in incognito mode
browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, response) {
  
  //care only about messages whose status is "initiated"
  if (request.status === "initiated") {

    if (request.action === "get") {
      save();
    }

    if (request.action === "open") {
      open(request.param);
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
async function save() {

  const tabs = await browser.tabs.query({ currentWindow: true });
  const urls = [];

  for (const tab of tabs) {
    if (tab.url) {
      urls.push(tab.url);
    }
  } 

  browser.runtime.sendMessage({action: "get", status: "fulfilled", param: urls});
}