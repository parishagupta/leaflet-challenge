// Define the URL for the earthquake data
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 4;
}

// Function to determine marker color based on earthquake depth
function markerColor(depth) {
  return depth > 90 ? "#ff3333" :
         depth > 70 ? "#ff8000" :
         depth > 50 ? "#ffb266" :
         depth > 30 ? "#ffe5cc" :
         depth > 10 ? "#ccff99" :
                      "#66ff66";
}

// Create the map object with options
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add tile layer for the map background
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Fetch earthquake data and add it to the map
d3.json(earthquakeUrl).then(function(data) {
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>Location: ${feature.properties.place}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(myMap);
});

// Create a legend to provide context for the map data
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend"),
      depthLevels = [-10, 10, 30, 50, 70, 90],
      colors = ["#66ff66", "#ccff99", "#ffe5cc", "#ffb266", "#ff8000", "#ff3333"];

  for (let i = 0; i < depthLevels.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ' +
      depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + ' km<br>' : '+ km');
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap);