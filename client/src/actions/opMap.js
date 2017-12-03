export const CHANGE_MAP_CENTER = 'CHANGE_MAP_CENTER';

export function recenterMap (mapCenter, zoom){
    return {type: CHANGE_MAP_CENTER, mapCenter, zoom}
}