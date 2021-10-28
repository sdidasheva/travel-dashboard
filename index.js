//Initializing modules
const moment = require('moment');
const Chart = require('chart.js')
const dataCountries = require('./countries.json');

// plugin for charts
const chartPlugin = {
    id: "chartPlugin",
    beforeDraw(chart, args, options) {
        const {
            ctx,
            chartArea: {
                top,
                right,
                bottom,
                left,
                width,
                height
            }
        } = chart;
        ctx.save();
        ctx.font = (height / 114).toFixed(2) + "em " + options.fontFamily;
        ctx.textAlign = "center";
        ctx.fillStyle = options.fontColor;
        let text = chartData[0] + "/" + chartDataMaxNumber;
        let textX = width / 2;
        let textY = (height / 2) + (options.fontSize * 0.14);
        ctx.fillText(text, textX, textY);
    }
};

// Event listener for dashboard
document.addEventListener("DOMContentLoaded", function (e) {
    chartCities() //default chart
    buttonClass[0].addEventListener("click", function (e) {
        chartCities()
    })
    buttonClass[1].addEventListener("click", function (e) {
        chartCountries()
    })
    buttonClass[2].addEventListener("click", function (e) {
        chartCapitals()
    })
})

// adding tooltips for friends list
let friendImg = document.getElementsByClassName("friend-img");
let toollip = document.getElementsByClassName("toollip");

for (let i = 0; i < toollip.length; i++) {
    friendImg[i].addEventListener("mouseover", showPopup);
    friendImg[i].addEventListener("mouseout", hidePopup);

    function showPopup(evt) {
        let iconPos = friendImg[i].getBoundingClientRect();
        toollip[i].style.left = (iconPos.right - 310) + "px";
        toollip[i].style.top = (window.scrollY + iconPos.top - 400) + "px";
        toollip[i].style.display = "block";
    }

    function hidePopup(evt) {
        toollip[i].style.display = "none";
    }
}


// initializing chartStatistics
const buttonClass = document.getElementsByClassName('btn-chart')
let ctx = document.getElementById('chartStatistics').getContext('2d');
let chartData;
let chartStatistics;
let chartDataMaxNumber;
let mapArr;
let mapArrAddress;
let chartVisitedCities;
let chartVisitedContinents;
let chartVisitedCapitals;
let chartVisitedCountries;

// creating arrays for charts
mapArr = JSON.parse(localStorage.getItem('map'));
if (mapArr == null) {
    let mapArr = " "
} else {
    mapArrAddress = mapArr.map(el => {
        return {
            address: el.address
        }
    })
    let spanArray = [];
    mapArrAddress.forEach(el => {
        if (!el.address) {
            el.address = " "
        }
        el.address = el.address.split(", ")
        for (let i = 0; i < el.address.length; i++) {
            spanArray.push(el.address[i])
        }
    });
    let countriesArray = spanArray.filter(el => el.includes("<span class=\"country-name\">"))
    let chartCitiesSpan = spanArray.filter(el => el.includes("<span class=\"locality\">"))
    // delete repeating in countries
    countriesArray = new Set(countriesArray);
    chartVisitedCountries = [...countriesArray]; // put length of this to country chart
    // getting rid of spans
    let chartAllCities = []
    chartCitiesSpan.forEach(el => {
        let newstr = el.replace(/(<([^>]+)>)/gi, "");
        chartAllCities.push(newstr)
    })
    // delete repeating in cities
    chartAllCities = new Set(chartAllCities);
    chartVisitedCities = [...chartAllCities];
    chartVisitedCapitals = []; // put length of this to capitals chart
    chartVisitedCities.forEach(city => {
        for (let i = 0; i < dataCountries.length; i++) {
            if (dataCountries[i].capital.includes(city)) {
                chartVisitedCapitals.push(city);
            }
        }
    })
    // matching visited country and region
    let countriesContinents = [];
    chartVisitedCountries.forEach(el => {
        let newstr = el.replace(/(<([^>]+)>)/gi, "");
        countriesContinents.push(newstr)
    })
    let chartContinents = [];
    countriesContinents.forEach(country => {
        for (let i = 0; i < dataCountries.length; i++) {
            if (dataCountries[i].name.includes(country)) {
                chartContinents.push(dataCountries[i].region);
            }
        }
    })
    // delete repeating in continents
    chartContinents = new Set(chartContinents);
    chartVisitedContinents = [...chartContinents]; // put length of this to continents chart

}



// function for chartCities
function chartCities() {
    for (let i = 0; i < buttonClass.length; i++) {
        buttonClass[i].setAttribute("aria-pressed", "false");
        buttonClass[i].classList.remove("active");
    }
    if (buttonClass[0].classList != "active") {
        buttonClass[0].classList.add("active");
        buttonClass[0].setAttribute("aria-pressed", "true");
    }
    if (chartStatistics != undefined) {
        chartStatistics.destroy();
    }
    ctx = document.getElementById('chartStatistics').getContext('2d');
    chartData = new Array(2);
    chartData[0] = 0;
    if (chartVisitedContinents) {
        chartData[0] = chartVisitedContinents.length
    };
    chartDataMaxNumber = 6;
    chartData[1] = chartDataMaxNumber - chartData[0];
    chartStatistics = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Visited", "Left to visit"],
            datasets: [{
                label: 'Continents',
                data: chartData,
                backgroundColor: [
                    'rgba(248, 101, 73)',
                    'rgba(237, 239, 239)'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItems, data) {
                            return '';
                        },
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index];
                        }
                    }
                },
                chartPlugin: {
                    fontColor: "rgba(248, 101, 73)",
                    fontSize: 80,
                    fontFamily: "sans-serif",
                }
            }
        },
        plugins: [chartPlugin],
    });
}

// function for chartCountries
function chartCountries() {
    for (let i = 0; i < buttonClass.length; i++) {
        buttonClass[i].setAttribute("aria-pressed", "false");
        buttonClass[i].classList.remove("active");
    }
    if (buttonClass[1].classList != "active") {
        buttonClass[1].classList.add("active");
        buttonClass[1].setAttribute("aria-pressed", "true");
    }
    if (chartStatistics != undefined) {
        chartStatistics.destroy();
    }
    chartStatistics.destroy();
    ctx = document.getElementById('chartStatistics').getContext('2d');
    chartData = new Array(2);
    chartDataMaxNumber = 250;
    chartData[0] = 0;
    if (chartVisitedCountries) {
        chartData[0] = chartVisitedCountries.length
    };
    chartData[1] = chartDataMaxNumber - chartData[0];
    chartStatistics = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Visited", "Left to visit"],
            datasets: [{
                label: 'Continents',
                data: chartData,
                backgroundColor: [
                    'rgba(248, 101, 73)',
                    'rgba(237, 239, 239)'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItems, data) {
                            return '';
                        },
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index];
                        }
                    }
                },
                chartPlugin: {
                    fontColor: "rgba(248, 101, 73)",
                    fontSize: 80,
                    fontFamily: "sans-serif",
                }
            }
        },
        plugins: [chartPlugin],
    });
}

// function for chartCapitals
function chartCapitals() {
    for (let i = 0; i < buttonClass.length; i++) {
        buttonClass[i].setAttribute("aria-pressed", "false");
        buttonClass[i].classList.remove("active");
    }
    if (buttonClass[2].classList != "active") {
        buttonClass[2].classList.add("active");
        buttonClass[2].setAttribute("aria-pressed", "true");
    }
    if (chartStatistics != undefined) {
        chartStatistics.destroy();
    }
    chartStatistics.destroy();
    ctx = document.getElementById('chartStatistics').getContext('2d');
    chartData = new Array(2);
    chartDataMaxNumber = 250;
    chartData[0] = 0;
    if (chartVisitedCapitals) {
        chartData[0] = chartVisitedCapitals.length
    };
    chartData[1] = chartDataMaxNumber - chartData[0];
    chartStatistics = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Visited", "Left to visit"],
            datasets: [{
                label: 'Continents',
                data: chartData,
                backgroundColor: [
                    'rgba(248, 101, 73)',
                    'rgba(237, 239, 239)'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItems, data) {
                            return '';
                        },
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index];
                        }
                    }
                },
                chartPlugin: {
                    fontColor: "rgba(248, 101, 73)",
                    fontSize: 80,
                    fontFamily: "sans-serif",
                }
            }
        },
        plugins: [chartPlugin],
    })
}

//===================Profile================================


postButton.onclick = function (e) {
    e.preventDefault();

    fetch("https://httpbin.org/post", {
            method: 'POST',
            body: new FormData(form_registr),
        })
        .then(response => response.json())

        .then(user => {    
            let serializedUser = JSON.stringify(user.form);
            localStorage.setItem("profile", serializedUser);
            out();
        })
        .catch(error => console.log(error));
}

function out() {
    document.getElementById("p_name").innerHTML = "";
    document.getElementById("p_city").innerHTML = "";
    let user_object = localStorage.getItem("profile");
    user_object = JSON.parse(user_object);
    document.getElementById("p_name").innerHTML += user_object.name_;
    document.getElementById("p_city").innerHTML += user_object.city_;
    document.getElementById("form_registr").reset();

}




const cardsContainer = document.getElementById('cards-container');
const showBtn = document.getElementById('show');
const hideBtn = document.getElementById('hide');
const photoElem = document.getElementById('inner_card_image');
const photoEl = document.getElementById('card_image')
const countrynameEl = document.getElementById('countryName');
const imageupload = document.getElementById('imageupload_button');
const addCardBtn = document.getElementById('add-card');
const addContainer = document.getElementById('add-container');


let currentActiveCard = 0;
const cardsEl = [];
const cardsData = getCardsData()

function createCards() {
    cardsData.forEach((data, index) => createCard(data, index));
}

function createCard(data, index) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `<div class="inner-card">
                    <img src=${data.photo} style="height:150px; border-radius:5%">
                    <p id="explore_countryname"><i class="fas fa-map-marker-alt"></i> ${data.countryname
                    }</p>
                </div>`;

    cardsEl.push(card);
    cardsContainer.appendChild(card);
    card.after(card)
}

function getCardsData() {
    const cards = JSON.parse(localStorage.getItem('cards'));
    return cards === null ? [] : cards;
}

function setCardsData(cards) {
    localStorage.setItem('cards', JSON.stringify(cards));
    window.location.reload();
}
createCards();

showBtn.addEventListener('click', () => addContainer.classList.add('show'));
hideBtn.addEventListener('click', () => addContainer.classList.remove('show'));
imageupload.addEventListener('change', function () {
    if (this.files[0].type != 'image/jpeg' && this.files[0].type != 'image/png' && this.files[0].type !=
        'image/gif') {
        alert('Sorry you have to upload an image')
    } else {
        photoEl.style.display = 'block';
        photoEl.src = URL.createObjectURL(this.files[0])
    }
})

addCardBtn.addEventListener('click', () => {
    const photo = photoEl.src;
    const countryname = countrynameEl.value;

    if (photo && countryname.trim()) {
        const newCard = {
            photo,
            countryname
        };
        createCard(newCard);


        photoEl.src = '';
        countrynameEl.value = '';

        addContainer.classList.remove('show');

        cardsData.push(newCard);
        setCardsData(cardsData);
    }

});

// Explore

let map;
let InfoWindow
let markers = [];
let localmarkers;
let searchBox;
let bounds;
let save = document.getElementById('map_button');
let icon = 'http://maps.google.com/mapfiles/marker.png';

function initMap() {
    InfoWindow = new google.maps.InfoWindow();
    localmarkers = JSON.parse(localStorage.getItem('map'));
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 43.238949,
            lng: 76.889709
        },
        zoom: 3
    });
    bounds = new google.maps.LatLngBounds();
    if (localmarkers != null) {
        for (let i = 0; i <= localmarkers.length - 1; i++) {
            showMarker(localmarkers[i], i);
        }
    } else {
        localmarkers = [];
    }
    searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });
    // markers = [];
    searchBox.addListener('places_changed', function () {
        searchMarker();
    });
}

function showMarker(m, id) {
    let marker = new google.maps.Marker({
        position: m['position'],
        icon: m['icon'],
        map: map
    });

    let InfoWindow = new google.maps.InfoWindow({
        content: m['content']
    });
    marker.addListener('click', function () {
        InfoWindow.open(map, marker);
    })
    markers.push(marker);
    // Extend markerBounds with each point.
    bounds.extend(m['position']);
}

function searchMarker() {
    searchBox.set('map', null);
    places = searchBox.getPlaces();
    bounds = new google.maps.LatLngBounds();
    let i, place;
    for (i = 0; place = places[i]; i++) {
        (function (place) {
            let marker = new google.maps.Marker({
                position: place.geometry.location
            });
            let InfoWindow = new google.maps.InfoWindow({
                content: `I've been to ${place.name}`
            });
            marker.addListener('click', function () {
                InfoWindow.open(map, marker);
            })

            localmarkers.push({
                name: place.name,
                address: place.adr_address,
                position: place.geometry.location,
                content: `I've been to ${place.name}`
            })
            let save = document.getElementById('map_button');
            google.maps.event.addDomListener(save, 'click', function () {
                localStorage.setItem('map', JSON.stringify(localmarkers))
            })


            marker.bindTo('map', searchBox, 'map');
            google.maps.event.addListener(marker,
                'map_changed',
                function () {
                    if (!this.getMap()) {
                        this.unbindAll();
                    }
                });
            bounds.extend(place.geometry.location);
        }(place));
    }
    map.fitBounds(bounds);
    searchBox.set('map', map);
    map.setZoom(Math.min(map.getZoom(), 12));
};



