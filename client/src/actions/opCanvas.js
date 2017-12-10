export const DRAW = 'DRAW';
export const SET_DRAWINGS = 'SET_DRAWINGS';
export const CHANGE_DESCRIPTION = 'CHANGE_DESCRIPTION';
export const SEND_DRAWING = 'SEND_DRAWING';

export function draw (boolean){
    return {type: DRAW, boolean}
}

export function setDrawings(drawings) {
    return {type: SET_DRAWINGS, drawings}
}

export function changeDescription(description) {
    return {type:CHANGE_DESCRIPTION, description}
}

export function sendDrawing(drawing, idUser, idGroup, description, zoom, center) {
    return {type: SEND_DRAWING, drawing, idUser, idGroup, description, zoom, center}
}