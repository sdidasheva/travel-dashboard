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



