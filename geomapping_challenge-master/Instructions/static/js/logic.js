    // Create the tile layer that will be the background of our map
    let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
    
    // Create a baseMaps object to hold the lightmap layer
    let baseMaps = {
      "Light Map": lightmap
    };
  let earthquakes = new L.LayerGroup();
  let tectonicplates = new L.LayerGroup();
    // Create an overlayMaps object to hold the bikeStations layer
    let overlayMaps = {
      "Tectonic Plates": tectonicplates,
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [40.73, -74.0059],
      zoom: 3,
      layers: [lightmap]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
        function styleinfo(feature) {

            return{
                opacity: 1,
                fillOpacity: 1,
                weight:0.5
            }
        }
        function getColor(d) {
          return d > 8 ? '#800026' :
                 d > 7  ? '#BD0026' :
                 d > 6  ? '#ec5d5e' :
                 d > 5  ? '#E31A1C' :
                 d > 4  ? '#FC4E2A' :
                 d > 3   ? '#FD8D3C' :
                 d > 2   ? '#FEB24C' :
                 d > 1   ? '#FED976' :
                            '#FFEDA0';
      } 
      function radius(d) {
        return d * 4
      }
      function style(feature) {
        return {
            fillColor: getColor(feature.properties.mag),
            radius: radius(feature.properties.mag),
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }
    
        L.geoJson(data, {
          // We turn each feature into a circleMarker on the map.
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
          },
          style:style
      }).addTo(earthquakes);
      var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
    });
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);
      tectonicplates.addTo(map);
    });
;
 