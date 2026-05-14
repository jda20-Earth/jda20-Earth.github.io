const params = new URLSearchParams(window.location.search);
const fName = params.get('firstName');
const lName = params.get('lastName');
name = fName;
if (lName != null) {
    name = fName + "+" + lName;
}
// Initialize the map

var map = L.map('map').setView([20, 0], 2);
// Add map style
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> | <a href="https://www.geonames.org/">Powered by GeoNames</a>'
    
}).addTo(map);

// fetch locations from GeoNames
async function findLocations() {
    const username = 'jda20'; 
    const url = `http://api.geonames.org/searchJSON?q=${name}}&maxRows=1000&username=${username}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        let locLoad = document.getElementById("loadingLoc");
        if (data.geonames.length > 0) {
            locLoad.remove();
            data.geonames.forEach(place => {
                L.marker([place.lat, place.lng])
                    .addTo(map)
                    .bindPopup(`<b>${place.name}</b><br>${place.countryName}<br>Description: ${place.fcodeName}`);

            });
        }
        else {
            locLoad.innerText = "No Locations Found!";
        }
    } catch (error) {
        console.error("GeoNames search failed:", error);
        let locLoad = document.getElementById("loadingLoc");
        locLoad.innerText = "GeoNames Search Error";
    }
}
findLocations();
