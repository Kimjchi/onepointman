export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';

export function changeAddress (newAddress, validAddress){
    return {type: CHANGE_ADDRESS, newAddress, validAddress}
}
