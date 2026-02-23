mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 13 // starting zoom
});
console.log(locations)

const marker1 = new mapboxgl.Marker({ color: 'red' })
    .setPopup(new mapboxgl.Popup({ offset: 20,className: 'my-location-class' })
        .setHTML(`<h1>${locations}</h1><h6>this is our location</h6>`))
    .setLngLat(coordinates)
    .addTo(map);
