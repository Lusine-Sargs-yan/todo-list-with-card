import {data} from '../data/data.js';
export const loadState = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        alert("Please, activate local storage!");
    }
};


export const saveState = (key, value) => {
    try {
        return localStorage.setItem(key, JSON.stringify(value));
    } catch {
        alert("Please, activate local storage!");
    }
};

saveState('TODO_DATA', data);