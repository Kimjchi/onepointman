export const CHANGE_MAP_CENTER = 'CHANGE_MAP_CENTER';
export const CHANGE_MARKER_SELECT = 'CHANGE_MARKER_SELECT';
export const CHANGE_MARKER_GEOLOCATION = 'CHANGE_MARKER_GEOLOCATION';
export const CHANGE_PINPOINTS = 'CHANGE_PINPOINTS';
export const CHANGE_LOCATION_SELECT = 'CHANGE_LOCATION_SELECT';
export const CHANGE_MAP = 'CHANGE_MAP';
export const CHANGE_MARKER_MEMBERS = 'CHANGE_MARKER_MEMBERS';

export function recenterMap (mapCenter, zoom){
    return {type: CHANGE_MAP_CENTER, mapCenter, zoom}
}

export function updateMarkerSelect (marker){
    return {type: CHANGE_MARKER_SELECT, marker}
}

export function updateMarkerMembers (markers){
    return {type: CHANGE_MARKER_MEMBERS, markers}
}

export function updateMarkerGeoLocation (markers){
    return {type: CHANGE_MARKER_GEOLOCATION, markers}
}

export function changePinPoints (pinPoints) {
    return {type : CHANGE_PINPOINTS, pinPoints}
}

export function changeLocationSelect (locationSelect) {
    return {type : CHANGE_LOCATION_SELECT, locationSelect}
}

export function changeMap (map) {
    return {type : CHANGE_MAP, map}
}