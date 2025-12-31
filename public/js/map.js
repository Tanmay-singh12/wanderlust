
// // public/js/map.js

// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//     zoom: 9 // starting zoom
// });

// // Add marker to the map at the listing's coordinates

// const marker = new mapboxgl.Marker({color: 'red'})
//     .setLngLat(listing.geometry.coordinates) // Set marker at the listing's coordinates
//     .setpopup(
//         new mapboxgl.Popup({ offset: 25 }) // add popups
//     .setHTML
//     (`<h3>${listing.location}</h3><p>exact location provided after booking</p>`))
//     .addTo(map);  


mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates,   // [lng , lat]
    zoom: 9
});

// add zoom buttons (optional)
map.addControl(new mapboxgl.NavigationControl());

// Marker + Popup
new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${listing.location}</h3>
                <p>Exact location provided after booking</p>`)
    )
    .addTo(map);

