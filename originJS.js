const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

const params = new URLSearchParams(window.location.search);
const fName = params.get('firstName');

const lName = params.get('lastName');

const country = params.get('country');

let originTitleText = document.getElementById("originTitleText");
originTitleText.innerText += ` ${fName}`;
originTitleText.innerText += ` ${lName}`;


let originLoading1 = document.querySelectorAll('.originLoading1');
let originLoading2 = document.querySelectorAll('.originLoading2');
let originLoading3 = document.querySelectorAll('.originLoading3');

let scriptHTML = document.getElementById("script");
let genderHTML = document.getElementById("gender");
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
      "firstName": `${fName}`,
      "lastName": `${lName}`,
      "countryIso2": `${country}`
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
  // Old Code, did not allow separating API results.
  // let uni = null;
  // if (prob < 0.6) {
  //   uni = "Likely Unisex Name"
  // }
  // scriptHTML.innerText += ` ${script}`;
  // genderHTML.innerText += ` ${likelyGender}`;
  // if (uni != null) {
  //   genderHTML.innerText += ` | ${uni}`;
  // }
  originLoading1.forEach(el => el.remove())
  scriptHTML.innerHTML = `Script: <span class="api-data">${script}</span>`;
  
  let genderDisplay = `<span class="api-data">${likelyGender}</span>`;
  if (attrib.probabilityCalibrated < 0.6) {
      genderDisplay += ` <span class="unisex-tag">| Likely Unisex</span>`;
  }
  genderHTML.innerHTML = `Most Likely Gender: ${genderDisplay}`;
  
} else {
  console.error("The request failed with status:", response1.status, response1);
  originLoading1.forEach(el => el.remove())
  scriptHTML.innerText += " genderGeoBatch - Script Request Failed";
  genderHTML.innerText += " genderGeoBatch - Likely Gender Request Failed";
}

let regionHTML = document.getElementById("region");
let subRegionHTML = document.getElementById("subregion");
let countriesListHTML = document.getElementById("countriesList");
const response2 = await fetch("https://v2.namsor.com/NamSorAPIv2/api2/json/originBatch", {
  "method": "POST",
  "headers": {
    "X-API-KEY": "33bb58d120059f22a4920811fec30fc4",
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "body": JSON.stringify({
  "personalNames": [
    {
      "firstName": `${fName}`,
      "lastName": `${lName}`
    }
  ]
})
});

if (response2.ok) {
  const data = await response2.json(); 
  const attrib = data.personalNames[0];
  const countries = attrib.countriesOriginTop;
  const region = attrib.regionOrigin;
  const subregion = attrib.subRegionOrigin;
  // Same issue with earlier JS.
  // regionHTML.innerText += ` ${region}`;
  // subRegionHTML.innerText += ` ${subregion}`
  originLoading2.forEach(el => el.remove())
  regionHTML.innerHTML = `Most Likely Region of Origin: <span class="api-data">${region}</span>`;
  subRegionHTML.innerHTML = `Most Likely Subregion: <span class="api-data">${subregion}</span>`;
  for (let country of countries) {
    let countryName = regionNames.of(`${country}`);
    let newElement = document.createElement("li");
    newElement.textContent = countryName;
    countriesListHTML.append(newElement)
  }
} else {
  console.error("The request failed with status:", response2.status, response2);
  originLoading2.forEach(el => el.remove())
  regionHTML.innerText += " originBatch - Region Request Failed";
  subRegionHTML.innerText += " originBatch - Subregion Request Failed";
  let newElement = document.createElement("li");
  newElement.textContent = " originBatch - Countries Request Failed";
  countriesListHTML.append(newElement)
}

let ethnicitiesHTML = document.getElementById("ethnicitiesList");
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
      "firstName": `${fName}`,
      "lastName": `${lName}`,
      "countryIso2": `${country}`
    }
  ]
})
});

if (response3.ok) {
  const data = await response3.json();  
  const attrib = data.personalNames[0];
  const ethnicities = attrib.ethnicitiesTop;
  for (let ethnicity of ethnicities) {
    let newElement = document.createElement("li");
    newElement.textContent = ethnicity;
    originLoading3.forEach(el => el.remove())
    ethnicitiesHTML.append(newElement)
  }
} else {
    console.error("The request failed with status:", response3.status, response3);
    let newElement = document.createElement("li");
    newElement.textContent = " diasporaBatch - Ethnicities/Diaspora Request Failed";
    originLoading3.forEach(el => el.remove())
    ethnicitiesHTML.append(newElement)
}
