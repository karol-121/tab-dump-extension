//function that check wheter given url is allowed by browser to be handled by extensions
//some urls can not be opened by extensions, therefore ignore them  
function isRestricted(url) {
	let isRestricted = false;

	const restrictedUrls = [/^chrome:/, /^javascript:/, /^data:/, /^file:/, /^about:/];

	for (const restrictedUrl of restrictedUrls) {

		if (restrictedUrl.test(url)) {
			isRestricted = true;
			break;
		}

	}

	return isRestricted;

}

//function that prepend defined default protocol to urls that misses it
function prependProtocol(url) {
	const startsWithProtocol = /^\w+:/; //matches urls that begins with protocol
	const defaultProtocol = "https://"; //protocol to append if url does not contain such

	if(!startsWithProtocol.test(url)) {
		url = defaultProtocol + url;
	}

	return url;
}

//functions that extract url values from user input
function extractUrls(text) {
	const matchComments = /^#.+/gm //matches strings that starts with "#"
	const matchUrls = /\S+/gm //matches text blocks separated with white space 

	const urls = new Array();

	let urlsTemp = text;

	//removing lines that starts with "#" as those are comments 
	urlsTemp = urlsTemp.replaceAll(matchComments, "");

	//creating match with everything but white spaces
	const urlMatches = urlsTemp.matchAll(matchUrls);

	//retrieving urls from matches
	for (const urlMatch of urlMatches) {

		let url = urlMatch[0];

		//check if url is restricted, if so do not push it further
		if (isRestricted(url)) {
			continue;
		}

		//add default protocol to link if missing, otherwise browser will fail to open this url
		url = prependProtocol(url);

		urls.push(url);

	}

	return urls;

}

//function that prints urls to text
function printUrls(tabs, config) {

	let outputText = "";

	for (const tab of tabs) {

		//check if url is restricted, if so ignore it in the final output
		if (isRestricted(tab.url)) {
			continue;
		}

		//if print should containt tab titles, print them
		if (config.returnTitles) {
			let commentLine = "#" + tab.title + '\n';
			outputText += commentLine;
		}

		//print url for each tab
		let urlLine =  tab.url + '\n\n';
		outputText += urlLine;

	}

	return outputText;

}

