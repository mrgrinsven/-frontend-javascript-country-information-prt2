import axios from 'axios';

// Reference naar HTML element
const countryInfo = document.getElementById('country-info');

// Functie die een object en een string verwacht en een boolean teuggeeft om alle alternatieve namen van landen te zoeken
function checkAltNames(object, input) {
    if (input === '') {
        return false;
    }
    if (object.name.toLowerCase() === input.toLowerCase()) {
        return true;
    }
    if (object.nativeName.toLowerCase() === input.toLowerCase()) {
        return true;
    }
    if (object.altSpellings === undefined) {
        return false;
    }
    for (let i = 0; i < object.altSpellings.length; i++) {
        if (object.altSpellings[i].toLowerCase() === input.toLowerCase()) {
            return true;
        }
    }
    return false;
}

// Functie die een array verwacht en een string terug geeft met de valuta's die gebruikt kunnen worden
function valuta(array) {
    if (array.length === 1) {
        return array[0].name;
    }
    if (array.length === 2) {
        return array[0].name + `'s and ${array[1].name}`;
    }
}

// Functie die een array verwacht en een string terug geeft met de gesproken talen
function language(array) {
    let text = '';
    for (let i = 0; i < array.length; i++) {
        if (i === 0) {
            text += `They speak ${array[i].name}`;
        }
        if (i > 0 && i < array.length -1) {
            text += `, ${array[i].name}`;
        }
        if (i > 0 && i === array.length - 1) {
            text += ` and ${array[i].name}`;
        }
    }
    return text;
}

// Asynchrone functie om informatie over alle landen op te halen en weer te geven
async function getCountryInfo(countryInput) {
    const URI = 'https://restcountries.com/v2/';
    const ALL = 'all';
    try {
        // Informatie ophalen met axios
        const result = await axios.get(URI + ALL);

        // Lijst leeg maken bij aanvang
        countryInfo.replaceChildren();

        // Land object zoeken
        const country = result.data.find((findCountry) => {
            return checkAltNames(findCountry, countryInput)
        });

        // Als country geen waarde kan vinden stop de functie
        if (country === undefined) {
            return;
        }

        // Elementen creeren
        const countryContainer = document.createElement('div');
        const nameContainer = document.createElement('div')
        const flagImage = document.createElement('img');
        const countryName = document.createElement('p');
        const countryPopulation = document.createElement('p');
        const countryCurrency = document.createElement('p');
        const countryLanguage = document.createElement('p');

        // Atributen toewijzen
        countryContainer.setAttribute('class', 'country-container');
        nameContainer.setAttribute('class', 'name-container');
        flagImage.setAttribute('src', `${country.flag}`);
        flagImage.setAttribute('alt', `${country.name}`);
        countryName.setAttribute( 'class', 'country-name-text');
        countryPopulation.setAttribute('class', 'country-text');
        countryCurrency.setAttribute('class', 'country-text');
        countryLanguage.setAttribute('class', 'country-text')

        // Text toewijzen aan de benodigde elementen
        countryName.textContent = country.name;
        countryPopulation.textContent = `${country.name} is situated in ${country.subregion}. It has a population of ${country.population} people.`;
        countryCurrency.textContent = `The capital is ${country.capital} and you can pay with ${valuta(country.currencies)}'s.`;
        countryLanguage.textContent = `${language(country.languages)}`;

        // Gecreerde elementen aan het juiste element toevoegen
        nameContainer.appendChild(flagImage);
        nameContainer.appendChild(countryName);
        countryContainer.appendChild(nameContainer);
        countryContainer.appendChild(countryPopulation);
        countryContainer.appendChild(countryCurrency);
        countryContainer.appendChild(countryLanguage);
        countryInfo.appendChild(countryContainer);

    } catch(error) {
        // Error loggen
        console.error(error);

        // Error weergeven op het scherm
        const errorMessage = document.getElementById( "error-message" );

        if (error.response.status === 404) {
            errorMessage.textContent = "Page Not Found | 404";
        }
        if (error.response.status === 500) {
            errorMessage.textContent = "Internal Server Error | 500";
        }
    }
}

// Event Listener voor zoek button
const countrySearch = document.getElementById('country-search');
const btn = document.getElementById('button');

btn.addEventListener( 'click', () => {
    getCountryInfo(countrySearch.value);
    countrySearch.value = '';
    countrySearch.blur();
});

countrySearch.addEventListener( 'keydown', (event) => {
    if (event.key === 'Enter') {
        getCountryInfo(countrySearch.value);
        countrySearch.value = '';
        countrySearch.blur();
    }
});