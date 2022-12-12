var map;
var markers = [];
var infoWindow;

var selectedMarker;

function initMap() {
    var Sabah = {
        lat:  5.948085, 
        lng: 116.089812
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: Sabah,
        zoom: 10,
        mapTypeId: "roadmap",
        /*styles:
            [
                {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "weight": "2.00"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#9c9c9c"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#f2f2f2"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#eeeeee"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#7b7b7b"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#46bcec"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#c8d7d4"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#070707"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                }
            ],
            */
        mapTypeControl: true,
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

//Search store from store name and zip code
function searchStores() {
    var foundStores = [];
    var inputValue = document.getElementById('inputValue').value; //the store name entered by user
    
    if (inputValue) {
        stores.forEach(function (store) {
            var postal = store.address.postalCode.substring(0, 6);
            var storeName = store.name;                     //name of stores already initialised
            var storeNameLower = storeName.toLowerCase();   //change the store names to lowercase
            var inputLower = inputValue.toLowerCase();      //change the store name etntered by user to lowercase
            
            //search from store name
            if (storeNameLower.indexOf(inputLower) != - 1) {
                foundStores.push(store);
            }
            //search from zip code
            else if(postal == inputValue){
                foundStores.push(store);
            }
            
        });
    }
    else {
        foundStores = stores;
    }

    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}


//clear other location not being searched
function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

//When click on store-container(the list of stores), the information on the marker will be displayed
function setOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

//Display store info below the search option
function displayStores(stores) {
    var storesHtml = "";
    stores.forEach(function (store, index) {
        var name = store.name;
        var address = store.addressLines;
        //var phone = store.phoneNumber;
        //var website = store.website;
        var city = store.address.city;
        var zipCode = store.address.postalCode;
        storesHtml += `
    <div class="store-container">
      <div class="store-container-background">
          <div class="store-info-container">
            <div class="store-container-name">
            ${name}
            </div>
            <div class="store-address">
              <span>${address[0]}</span>
              <span>${address[1]}</span>
            </div>
            <div class="store-phone-number">
            ${zipCode}, ${city}
            </div>
          </div>
          <div class="store-number-container">
            <div class="store-number">
              ${index + 1}
            </div>
          </div>
        </div>
    </div>
    `
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;
}

//Initialize value from store-data then create marker
function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function (store, index) {
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        var name = store.name;
        var address = store.addressLines[0];
        var openStatusText = store.openStatusText;
        var phoneNumber = store.phoneNumber;
        var website = store.website;
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phoneNumber, website, index);
    })
    map.fitBounds(bounds);
}

//Display the marker on a pop up above the marker
function createMarker(latlng, name, address, openStatusText, phoneNumber, website, index) {
    
    //If there is no website value,
    if(website === '' ){
        //And no phone number value, then output store name and location only
        if(phoneNumber === ''){
            var html = `
            <div class="store-info-window">
                <div class="store-info-name">
                ${name}
                </div>
                <div class="store-info-address">
                    <div class="circle">
                        <i class="fas fa-location-arrow"></i>
                    </div>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${latlng}" style="color: #514C4C" target="_blank">${address}</a>
            </div>
            `
        }
        //Ouput store name, location and phone number
        else{
        var html = `
            <div class="store-info-window">
                <div class="store-info-name">
                    ${name}
                </div>
                <div class="store-info-address">
                    <div class="circle">
                        <i class="fas fa-location-arrow"></i>
                    </div>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${latlng}" style="color: #514C4C" target="_blank">${address}</a>
                </div>
                <div class="store-info-address">
                    <div class="circle">
                        <i class="fa fa-phone"></i>
                    </div>
                    <a href="tel:+${phoneNumber}" style="color: #514C4C" target="_blank">${phoneNumber}</a>
                </div>
            </div>
        `
        }
    }

    //If there is no phone number value, then output only the store name, location and website
    else if(phoneNumber === ''){
        var html = `
            <div class="store-info-window">
                <div class="store-info-name">
                    ${name}
                </div>
                <div class="store-info-address">
                    <div class="circle">
                        <i class="fas fa-location-arrow"></i>
                    </div>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${latlng}" style="color: #514C4C" target="_blank">${address}</a>
                </div>
                <div class="store-info-address">
                    <div class="circle">
                    <i class="fa fa-globe"></i>
                    </div>
                    <a href="${website}" style="color: #514C4C" target="_blank">${website}</a>
                </div>
            </div>
        `
    }

    //If all values are available, output all
    else{
        var html = `
            <div class="store-info-window">
                <div class="store-info-name">
                    ${name}
                </div>
                <div class="store-info-address">
                    <div class="circle">
                        <i class="fas fa-location-arrow"></i>
                    </div>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${latlng}" style="color: #514C4C" target="_blank">${address}</a>
                </div>
                <div class="store-info-address">
                    <div class="circle">
                        <i class="fa fa-phone"></i>
                    </div>
                    <a href="tel:+${phoneNumber}" style="color: #514C4C" target="_blank">${phoneNumber}</a>
                </div>
                <div class="store-info-address">
                    <div class="circle">
                        <i class="fa fa-globe"></i>
                    </div>
                    <a href="${website}" style="color: #514C4C" target="_blank">${website}</a>
                </div>
            </div>
        `
    }


    //Marker icon and size
    var canned = {
        url: './images/canned.png',
        scaledSize: new google.maps.Size(40, 55)
    };
    //Marker animation
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        // label: `${index + 1}`,
        icon: canned,
        animation: google.maps.Animation.DROP,
    });

    //Add zoom when press on marker
    google.maps.event.addListener(marker,'click',function() {
        map.setZoom(13);
        map.setCenter(marker.getPosition());
    });

    //Show info when click on marker
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);

        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 700); // current maps duration in ms of one bounce 
    });
    markers.push(marker);
}

    inputValue.addEventListener("keyup", function (event) {
    if (event.keyCode === 15) {
        event.preventDefault();
        document.getElementById("myBtn").click();
    }
    });