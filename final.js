const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const data = null;

const xhr = new XMLHttpRequest();
const nameOfDay = document.getElementById("nameofDay");
const scriptHTML = document.getElementById("script");
const genderHTML = document.getElementById("gender");

document.addEventListener('DOMContentLoaded', () => {
    populateNameDatalist();
});

function populateNameDatalist() {
    const datalist = document.getElementById('nameList');

    // Fetch extracted database file (was from "npm install usbabynames", 1000 names from 2024)
    fetch('top_names.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(namesArray => {
            namesArray.forEach(name => {
                const optionElement = document.createElement('option');
                optionElement.value = name.replace(/\b\w/g, char => char.toUpperCase());
                datalist.appendChild(optionElement);
            });
        })
        .catch(error => {
            console.error('Failed to populate datalist:', error);
        });
}





xhr.addEventListener('readystatechange', async function () {
  if (this.readyState === this.DONE) {
    const data = JSON.parse(this.responseText);
    let nameli = [];
    let countryli = [];
    let countries = data.data;
    for (const [key, value] of Object.entries(countries)) {
        let temp = [];
        if (key != "ru" && value != "n/a") {
            temp = value.split(',');
            for (let name of temp) {
                nameli.push(name);
                countryli.push(key)
            }
        }
        
    }
    let num = Math.floor(Math.random() * nameli.length)
    const nameval = nameli[num].replace(' ', '');
    const countryval = countryli[num].toUpperCase();
    const countryName = regionNames.of(`${countryval}`);

    nameOfDay.innerText = `${nameval} | ${countryName}`;
    const response1 = await fetch("https://v2.namsor.com/NamSorAPIv2/api2/json/genderGeoBatch", {
        "method": "POST",
        "headers": {
            "X-API-KEY": "33bb58d120059f22a4920811fec30fc4",
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
        "personalNames": [
            {
            "firstName": `${nameval}`,
            "countryIso2": `${countryval}`
            }
        ]
        })
        });
    if (response1.ok) {
    const data = await response1.json();
    const attrib = data.personalNames[0];
    const script = attrib.script;
    const likelyGender = attrib.likelyGender;
    const prob = attrib.probabilityCalibrated;

    scriptHTML.innerHTML = `Script: <span class="api-data">${script}</span>`;
    
    let genderDisplay = `<span class="api-data">${likelyGender}</span>`;
    if (attrib.probabilityCalibrated < 0.6) {
        genderDisplay += ` <span class="unisex-tag">| Likely Unisex</span>`;
    }

    genderHTML.innerHTML = `Most Likely Gender: ${genderDisplay}`;
    } else {
    console.error("The request failed with status:", response1.status, response1);
    scriptHTML.innerText = "genderGeoBatch - Script Request Failed";
    genderHTML.innerText = "genderGeoBatch - Likely Gender Request Failed";
    }
    let ethnicityHTML = document.getElementById("ethnicity");
    const response3 = await fetch("https://v2.namsor.com/NamSorAPIv2/api2/json/diasporaBatch", {
    "method": "POST",
    "headers": {
        "X-API-KEY": "33bb58d120059f22a4920811fec30fc4",
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    "body": JSON.stringify({
    "personalNames": [
        {
        "firstName": `${nameval}`,
        "countryIso2": `${countryval}`
        }
    ]
    })
    });

    if (response3.ok) {
    const data = await response3.json(); 
    const attrib = data.personalNames[0];
    const ethnicity = attrib.ethnicity;
    ethnicityHTML.innerHTML = `Likely Ethnicity: <span class="api-data">${ethnicity}</span>`;
    } else {
    console.error("The request failed with status:", response3.status, response3);

    }

  }
  else {

  }
});

xhr.open('GET', 'https://nameday.abalin.net/api/V2/today/PST');
xhr.setRequestHeader('Accept', 'application/json');
xhr.setRequestHeader('timezone', 'PST')
xhr.send(data);


