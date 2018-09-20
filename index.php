<?php

include "header.inc";

$counter = 1;

if($_SERVER["REQUEST_METHOD"] == "GET") {

	$location = $_GET['location'];
	echo '<div id="card' . $counter . '" class="placecard">' . $location . '</div>\n';
}// if

include "footer.inc";

?>