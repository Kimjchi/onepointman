export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';
export const CHANGE_SHARING_MODE = 'CHANGE_SHARING_MODE';
export const CHANGE_RDV_MODAL_VISIBILITY = 'CHANGE_RDV_MODAL_VISIBILITY'

export function changeAddress (newAddress, validAddress){
    return {type: CHANGE_ADDRESS, newAddress, validAddress}
}

export function changeSendingMode () {
    return {type : CHANGE_SHARING_MODE}
}

export function changeRdvModalVisibility () {
    return {type : CHANGE_RDV_MODAL_VISIBILITY}
}