const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
const params = new URLSearchParams(window.location.search);
const fName = params.get('firstName');

const lName = params.get('lastName');

let nameStr = fName;
if (lName != null) {
    nameStr += " " + lName
}

fetch('https://api.api-ninjas.com/v1/celebrity?name=' + encodeURIComponent(nameStr), {
    method: 'GET',
    headers: {
        'X-Api-Key': 'Vlnul1Paq9Ldd9sj7XMKfWjWOgcPCQXMvfgwVoOl',
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
})
.then(result => {
    if (result.length > 0) {
        let loadingFam = document.getElementById("loadingFamous");
        loadingFam.remove()
        for (let person of result) {
            var name = person.name;
            // name lacks capitalization.
            name = name.replace(/\b\w/g, char => char.toUpperCase());
            let containerHTML = document.getElementById("originContainer");
            let newElement = document.createElement("h2");
            newElement.textContent = `${name}`;
            var netWorth = "$" + person.net_worth || 'Unlisted';
            var nationality = person.nationality || null;
            var age = person.age || 'Unlisted';
            if (age != 'Unlisted') {
                age = age + " Years Old"
            }
            var isAlive = person.is_alive || 'Unlisted';
            if (isAlive == true){
                isAlive = "Yes"
            }
            else if (isAlive == false) {
                isAlive = "No"
            }
            var birthday = person.birthday || 'Unlisted';
            var death = person.death || 'Unlisted';
            var occupation = person.occupation || null;
            if (person.occupation != null) {
                var topOccupation = occupation[0] || 'Unlisted';
                // top Occupation has underscores and lacks capitalization.
                topOccupation = topOccupation.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            }
            else {
                topOccupation = 'Unlisted';
            }
            let countryName = null;
            if (nationality != null) {
                countryName = countryNames.of(`${nationality.toUpperCase()}`);
            }
            else {
                countryName = `Unlisted`;
            }

            let newList = document.createElement("ul");

            newList.innerHTML = `<li>Net Worth: ${netWorth}</li>
            <li>Nationality/Region: ${countryName}</li>
            <li>Age: ${age}</li>
            <li>Living?: ${isAlive}</li>
            <li>Birthday (YYYY-MM-DD): ${birthday}</li>
            <li>Death (YYYY-MM-DD): ${death}</li>
            <li>Occupation: ${topOccupation}</li>`

            newElement.append(newList);    
            containerHTML.append(newElement);

        }
    } else {
        let loadingFam = document.getElementById("loadingFamous");
        loadingFam.remove()
        let containerHTML = document.getElementById("originContainer");
        containerHTML.innerHTML = "<h2>No celebrity found with that name!</h2>"
    }
})
.catch(error => {
    console.error('Error:', error);
    loadingFam.innerText = "Celebrity API Error";
});


