const locationBtns = document.querySelectorAll('.location-btn')
const modalLayer = document.querySelector('.modal-layer')
const dynamicLink = document.querySelector('.modal__dynamic-link')
let currentMarker = null

for (const btn of locationBtns) {
  const { longitude, latitude } = btn.dataset
  btn.addEventListener('click', () => genDynamicMap(longitude, latitude))
}

function showModal () {
  modalLayer.classList.toggle('modal-layer--showing')
}

function genDynamicMap (lng, ltd) {
  if (currentMarker) {
    currentMarker.remove()
  }
  dynamicLink.setAttribute('href', genGoogleMapsLink(lng, ltd))
  showModal()
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
