const locationContent = document.querySelector('.location')
const locationBtns = document.querySelectorAll('.location-btn')
const dynamicLink = document.querySelector('.location__dynamic-link')
let currentMarker = null

for (const btn of locationBtns) {
  const { longitude, latitude } = btn.dataset
  btn.addEventListener('click', () => genDynamicMap(longitude, latitude))
}

function genDynamicMap (lng, ltd) {
  if (currentMarker) {
    currentMarker.remove()
  }
  dynamicLink.setAttribute('href', genGoogleMapsLink(lng, ltd))
  showModal(locationContent)
  setTimeout(() => {
    const center = [lng, ltd]
    map.flyTo({
      center,
      essential: true
    })

    currentMarker = new mapboxgl.Marker(createMarker()).setLngLat(center).addTo(map)
  }, 800)
}

function genGoogleMapsLink (lng, ltd) {
  return `http://maps.google.co.uk/maps?q=${ltd},${lng}`
}

function createMarker () {
  const el = document.createElement('div')
  el.classList.add('marker')

  return el
}
