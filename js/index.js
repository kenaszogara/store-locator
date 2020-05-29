let map;
let markers = [];
let infoWindow;
let toggle = false;

function initMap() {
  let losAngeles = {
    lat: 34.063380,
    lng: -118.358080
  }

  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 12,
    styles: gmapStyle,
    scaleControl: false,
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    disableDefaultUI: true,
  })

  infoWindow = new google.maps.InfoWindow()
  displayStores(stores)
}

function displayStores(stores) {
  var storeHtml = ''
  stores.forEach((store, index) => {
    storeHtml += ` 
      <div class="store-container">
        <div class="store-data">
          <div class="store-address">
            ${store.name}
          </div>
          <div class="store-phone">
            <span>${store.addressLines[0]}</span>
            <span>${store.addressLines[1]}</span>
          </div>
        </div>
        <div class="store-counter"><p>${index + 1}</p></div>
      </div>
      <hr>
    `
  });
  document.querySelector('.store-list').innerHTML = storeHtml

  clearMarkers()
  showStoreMarker(stores)
}

function showStoreMarker(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach((store, index) => {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude);

    bounds.extend(latlng);
    createMarker(latlng, store, index)
  });
  map.fitBounds(bounds);

  setStoreContainerOnClickListener()
}

function createMarker(latlng, store, index) {
  var address = store.addressLines[0]
  var html = `
    <div class="info-window">
      <div style="border-bottom: 1px solid gray; margin-bottom: 10px;">
        <div class="info-name">${store.name}</div>
        <div class="info-time">${store.openStatusText}</div>
      </div>
      <div class="info-location">
        <div class="info-location-icon circle" >
          <i class="fas fa-location-arrow"></i>
        </div>
        <span id="infoAddress" onclick="markerDirections()">
          ${address}
        </span>
      </div>
      <div class="info-phone">
        <span class="info-phone-icon circle">
          <i class="fas fa-store-alt"></i>
        </span>
        ${store.storeNumber}
      </div>
    </div>
  `

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${index+1}`
  });

  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });

  markers.push(marker);
}

function setStoreContainerOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container")
  storeElements.forEach((elem, index) => {
    elem.addEventListener('click', () => {
      google.maps.event.trigger(markers[index], 'click');

      // if on mobile screen, toggle hide
      screen.width <= 425 ? toggleHide() : null ;
    })
  })
}

function searchStores() {
  var foundStores = []
  var filter = document.getElementById('search').value.toLowerCase()
  if (filter) {
    stores.forEach(store => {
      var key = store.name.toLowerCase()
      if (key.includes(filter)) {
        foundStores.push(store)
      }
    })
  } else {
    foundStores = stores
  }
  
  displayStores(foundStores)
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = []
}

function markerDirections() {
  name = document.getElementById('infoAddress').innerHTML
  destination = name.trim().replace(' ', '+')
  origin = 'Surabaya,+Surabaya+City,+East+Java'
  travelmode = 'driving'
  url = `https://www.google.com/maps/dir/?api=1&origin=${origin}+WA&destination=${destination}&travelmode=${travelmode}`

  location.href = url
}

function toggleHide() {
  element = document.querySelector('.drop-down')
  title = document.querySelector('.title')
  search = document.querySelector('.search-container')
  storeList = document.querySelector('.store-list-container')

  if(!toggle) {
    element.classList.add('toggle-drop-down')
    title.classList.add('transformY-500')
    search.classList.add('transformY-500')
    storeList.classList.add('transformY-500')

    toggle = true;
  } else {
    element.classList.remove('toggle-drop-down')
    title.classList.remove('transformY-500')
    search.classList.remove('transformY-500')
    storeList.classList.remove('transformY-500')

    toggle = false;
  }
}

// if not on mobile remove drop-down, refresh toggle
screen.width <= 425 ? document.querySelector('.drop-down').classList.add('visible') : none 
