export const CHANGE_MAP_CENTER = 'CHANGE_MAP_CENTER';
export const CHANGE_MARKERS = 'CHANGE_MARKERS';
export const CHANGE_MARKER_GEOLOCATION = 'CHANGE_MARKER_GEOLOCATION';

export function recenterMap (mapCenter, zoom){
    return {type: CHANGE_MAP_CENTER, mapCenter, zoom}
}

export function updateMarkers (markers){
    return {type: CHANGE_MARKERS, markers}
}

export function updateMarkerGeoLocation (markers){
    return {type: CHANGE_MARKER_GEOLOCATION, markers}
}