/***************************************************************************
 * Author: Nilay Sondagar
 * Filename: img_scrape.js
 * Date: July 8, 2018
 * Purpose: Chrome Extension for scraping data off a webpage.
 ***************************************************************************/

var images = document.getElementsByTagName("IMG"); 
var imageSources = [];
var imageBoxes = document.getElementsByTagName("ARTICLE");
var locations = [];

//console.log(imageBoxes);

// Adds all the images it finds on the loaded Instagram page EXCEPT profile pictures
for(var i = 0; i < images.length; i++) {
	if(!images[i].alt.includes("profile")) {
		imageSources.push(images[i].src);
	}// if

}// for

// Adds the corresponding locations into an array. If no location, adds "No location found!" to the array
for(var i = 0; i < imageBoxes.length; i++) {
	if(imageBoxes[i].childNodes[0].childNodes[1].childNodes[1].childNodes.length != 0) {
		locations.push(imageBoxes[i].childNodes[0].childNodes[1].childNodes[1].childNodes[0].innerText)
	} else {
		locations.push("No location found!");
	}
}// for


//Post to a background page in the Chrome Extension, and passes the arrays for processing the scraped data
    chrome.runtime.sendMessage({ cmd: "printImages", imgs: imageSources, lctns: locations});