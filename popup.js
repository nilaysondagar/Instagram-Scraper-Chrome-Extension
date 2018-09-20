/***************************************************************************
 * Author: Nilay Sondagar
 * Filename: popup.js
 * Date: July 8, 2018
 * Purpose: Chrome Extension for scraping data off a webpage.
 ***************************************************************************/

'use strict';

/* The way the locations_to_send array is structed is as follows. The first half of the array consists of locations (Text).
	The second half consists of the corresponding Instagram images. The array will ALWAYS have the same amount of locations
	and images. Therefore the number of elements in the array will ALWAYS be an even number. For example:
	
	locations_to_send = {location1}, {location1}, {location3}, {img1}, {img2}, {img3} 
				Index =		 0			  1 			2		  3		  4		  5  
	
	That means the corresponding image for location1 is stored at locations_to_send[locations_to_send.length/2 + index_of_location].
	So location2 is at index 1 in the array, meaning the corresponding image is stored at locations_to_send[6/2 + 1] = locations_to_send[4], 
		which we can verify is correct by looking at the example array above! This is how the array is loaded in JavaScript, and the
		GET array in PHP is set up the exact same way. Hopefully this makes sense, because this is probably the most compicated code I
		have in all the files. If you have any issues, feel free to email me at nilay@sondagar.com! */
var locations_to_send = [];
var images;

let analyze = document.getElementById('analyze');

// When the "find my path." button is clicked, it sends the images and locations scraped from Instagram to the path webpage
analyze.onclick = function(element) {
  
	var location_list = "http://nilay.sondagar.com/Tamiko/index.php?"; // Base address for the path. website

  // Cycles through the locations list, and adds the locations to the URL, so the GET array contains the locations, which allows the webpage to parse the data 
  for (var i = 0; i < locations_to_send.length; i++) {
  		
  		// If there is a location, add to the URL, else add "Where is this?" to the URL
  		if(locations_to_send[i] != "No location found!") {
  			location_list = location_list + i + "=" + locations_to_send[i];
  		} else {
  			location_list = location_list + i + "=" + "Where is this?";
  		}// if else

		location_list += "&";

  };

  // This adds the Instagram images to the URL so the GET array contains the images for the webpage to store.
  // Does this for loop look weird? Well that's because it is!
  	// This adds the images to the same array as the locations and just adds them to the end. 
  for (var i = locations_to_send.length; i < (2 * locations_to_send.length); i++) {

  	location_list = location_list + i + "=" + images[i-locations_to_send.length];

  	if(i != (2 * (locations_to_send.length) - 1)) {
  			location_list += "&";
  		}// if

  };

  // This opens the path. website with all the parameters loaded into the URL, which in turn, loads them into the PHP GET array
  window.open(location_list);

  /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: "img_scrape.js"});
  });*/

};

// When the page is opened, inject the "img_scrape.js" file into the Instagram page to scrape the images and load them into an array
	// The JavaScript has to be stored in a seperate file so it runs on the webpage rather than in the CE.
	// There's also something about Cross-Site Scripting or some safety hazard that prevents the JS to run if it's embedded in this file.
document.getElementsByTagName("body")[0].onload = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: "img_scrape.js"});
  });

};

// This function prints the image into the CE when the array in img_scrape.js has been successfully created
chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {

	if (request.cmd == "printImages") {

		images = request.imgs;
		var locations = request.lctns;
        var numImages = images.length;
        var temp;
        var temp2;
        var temp3;
        var send;

        if(numImages > 0) {

        	// Clears the previous stuff in the CE to prevent duplicate images
         	document.getElementById("content").innerHTML = "";

         	// Cycles through the array and creates a new container, image and location tag for each image.
			for (var i = 0; i < numImages; i++) {
				temp3 = document.createElement("DIV");
				temp3.id = "box" + i;
				temp3.className = "imageBox";

				temp = document.createElement("DIV");
				temp.className = "image";
				temp.id = i;
				temp.style.backgroundImage = "url('" + images[i] +"')";

				// Adds an onclick listener so when the image is clicked, it can be selected to send to the path. website
				temp.addEventListener("click", function() {
					this.style.backgroundImage = "url('checkedimage.png')";
					send = document.getElementById("box" + parseInt(this.id)).getElementsByTagName("A");
					console.log(send);
					locations_to_send.push(send[0].innerHTML);
				});
				
				temp2 = document.createElement("A");
				temp2.innerHTML = locations[i];
				temp2.className = "locationtag";
				temp2.target = "_blank";

				if(locations[i] != "No location found!") {
					temp2.href = "http://nilay.sondagar.com/Tamiko/index.php?0=" + locations[i];
				}// if


				// Append items to the CE 
				document.getElementById("content").appendChild(temp3);
				document.getElementById(temp3.id).appendChild(temp);
				document.getElementById(temp3.id).appendChild(temp2);
			}// for

        }// if
	}
});