/* eslint-disable no-undef */
const center = [-38.882381, -4.329050]
mapboxgl.accessToken = 'pk.eyJ1IjoiaXRhbG9hcmF1am8yNTMiLCJhIjoiY2xpdGJheHRuMDJ1dzNkbzJvY3kzajlmNCJ9.QG9IzAFCdTXWJG5TZLtRnQ'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center,
  zoom: 16
})
map.addControl(new mapboxgl.NavigationControl())
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  })
)
