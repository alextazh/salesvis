# SalesVis
A web app that communicates with a java-based backend, fetches data and visualizes that data with highcharts.js

## Java backend and getJSON
Backend.jar file provides the data. Data is fetched via jquery getJson:
$.getJSON('http://localhost:5000/salesmandata', {'sessionid' : $.cookie('sessionCookie')}, function(data) {
	// do stuff
});
Check js/app.js to see this. Links need to point to backend.jar/endpoint path

## Angular routing
Routing is done via Angular.js
See app.js as well

## Cookies
Cookies set up is not finished.