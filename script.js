mapboxgl.accessToken = 'pk.eyJ1IjoiaXphd2F5YW4iLCJhIjoiY2x5ZjhnYTA4MGJ0eDJrcG15cTd6NHBmeCJ9.UQ4yc1uBgl3hr5UlL24FAQ';

document.getElementById('continueButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function showPosition(position) {
    const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    const destinations = [
        { lat: 22.9430351, lng: -43.2966886 },
        { lat: -23.0037871, lng: -43.2930177 },
        { lat: -22.9860342, lng: -43.2815749 }
    ];

    calculateShortestRoute(userLocation, destinations);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function calculateShortestRoute(origin, destinations) {
    let shortestDistance = Infinity;
    let nearestDestination = null;

    destinations.forEach(dest => {
        const distance = getDistance(origin, dest);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestDestination = dest;
        }
    });

    navigateWithWaze(origin, nearestDestination);
}

function getDistance(origin, destination) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(destination.lat - origin.lat);
    const dLng = deg2rad(destination.lng - origin.lng);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(origin.lat)) * Math.cos(deg2rad(destination.lat)) * 
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function navigateWithWaze(origin, destination) {
    if (origin && destination) {
        const wazeURL = `https://waze.com/ul?ll=${destination.lat},${destination.lng}&navigate=yes&from=${origin.lat},${origin.lng}`;
        window.location.href = wazeURL;
    } else {
        alert("No destination found.");
    }
}
