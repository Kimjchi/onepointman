export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';

export function changeAddress (newAddress){
    return {type: CHANGE_ADDRESS, newAddress}
}
