import AsyncStorage from "@react-native-community/async-storage";

/* eslint-disable prettier/prettier */
export function dateMaskBr(date) {
    let newDate = dateMask(date).split('-');
    return newDate[2] + '/' + newDate[1] + '/' + newDate[0];
}
export function dateMask(date) {
    let data = new Date(date);
    let day = String(data.getDate()).padStart(2, '0');
    let month = String(data.getMonth() + 1).padStart(2, '0');
    let year = data.getFullYear();
    return year + '-' + month + '-' + day;
}

export function hourMask(hour) {
    let newHH = new Date(hour);
    let hh = String(newHH.getHours()).padStart(2, '0');
    let mm = String(newHH.getMinutes()).padStart(2, '0');
    let ss = String(newHH.getSeconds()).padStart(2, '0');
    let result = `${hh}:${mm}:${ss}`;
    return result;
}

export function weightMask(weight) {
    if (weight.includes('.')) {
        let value = weight.split('.');
        return `${value.length > 0 ? `${value[0]},${value[1]}` : value[0]}`;
    }else{
        return weight;
    }
}

export async function post(key, value) {
    let result;
    try {
        if (typeof value !== 'string') throw Error("O valor infomardo não é um texto.");
        await AsyncStorage.setItem(key, value);

    } catch (error) {
        console.warn(error, key);
    }
}
export async function get(key) {
    let result;
    try {
        result = await AsyncStorage.getItem(key);
        if (result === null) throw Error("Dados não Encontrados.")
    } catch (error) {
        console.warn(error);
    }
    return result;
}