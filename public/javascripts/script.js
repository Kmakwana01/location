const socket = io()

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords
            socket.emit('send-location', { latitude, longitude })
        },
        (error) => {
            console.log(error)
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        })
}

const map = L.map('map').setView([0, 100], 16)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "OpenStreetMap"
}).addTo(map)


const markers = {}

socket.on('received-location', (data) => {
    console.log(data, markers)
    const { id, latitude, longitude } = data;
    console.log('id', id);
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude])
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
})
socket.on('user-disconnect', ({ id }) => {
    if (markers[id]) {
        map.removeLayer(markers[id])
        delete markers[id]
    }
})


socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
});