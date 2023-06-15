const checkbox = document.querySelector('input[name="location"]')

let userLocation = null
let locationPermission = null

checkbox.addEventListener('click', e => getLocation(e))

// check location permission
navigator
  .permissions
  .query({ name: 'geolocation', userVisibleOnly: true })
  .then(result => {
    locationPermission = result.state
    result.addEventListener('change', () => {
      locationPermission = result.state
    })
  })

// location checkbox click event
function getLocation (event) {
  if (locationPermission !== 'denied') {
    if (!userLocation) {
      event.preventDefault()
      navigator.geolocation.getCurrentPosition(position => {
        const { longitude, latitude } = position.coords
        userLocation = position
        checkbox.setAttribute('value', `${longitude};${latitude}`)
        centerMap(longitude, latitude)
        checkbox.checked = true
      }, () => {
        alert('por favor, ative a permissão de localização para utilizar esse recurso')
      })
    } else {
      if (checkbox.checked) {
        const { longitude, latitude } = userLocation.coords
        centerMap(longitude, latitude)
        checkbox.setAttribute('value', `${longitude};${latitude}`)
      } else {
        checkbox.removeAttribute('value')
      }
    }
  } else {
    event.preventDefault()
    alert('por favor, ative a permissão de localização para utilizar esse recurso')
  }
}

function centerMap(lng, ltd) {
  map.flyTo({
    center: [lng, ltd],
    essential: true
  })
}
