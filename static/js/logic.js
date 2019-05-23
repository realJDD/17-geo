// Creating map object
var myMap = L.map("map", {
  center: [49.2462, -123.1162],
  zoom: 3.5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: CIPHER
}).addTo(myMap);

// Define a markerSize function that will give each earthquake a different radius based on its magnitude
function markerSize(mag) {
  return mag * 20000;
}

// Define a fillColor function that will give each earthquake a different color based on its magnitude
function fillColor(mag) {
  let color = "";
  if (mag > 3) {
      color = "red";
  }
  else if (mag > 2) {
      color = "yellow";
  }
  else if (mag > 1) {
      color = "green";
  }
  else {
        color = "white";
  }
  return color;
}

(async function(){
    // Link to GeoJSON
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
    const response = await d3.json(url);
    // Grab the features out of the response data
    var earthquakeEvents = response.features;

    // Loop through the earthquakeEvents and create one marker for each earthquake
    earthquakeEvents.forEach(earthquake => {
        L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            fillOpacity: 0.5,
            color: "white",
            stroke: 0,
            fillColor: fillColor(earthquake.properties.mag),
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            radius: markerSize(earthquake.properties.mag)
        }).bindPopup("<h1>" + earthquake.properties.type +
        "</h1> <hr> <h3>Magnitude: " + earthquake.properties.mag +
        "</h3> <hr> <h3>Location: " + earthquake.properties.place +
        "</h3> <hr> <h3>Date & Time: " + new Date(earthquake.properties.time) +
        "</h3>").addTo(myMap);
      })
  })()
