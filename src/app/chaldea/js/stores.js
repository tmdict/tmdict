import { writable } from 'svelte/store';

export const activeLang = writable('en');
export const activeLangTick = writable(false);
export const filters = writable({});
export const sortBy = writable({});
export const theme = writable(localStorage.getItem('tmdict.chaldea.theme') || 'chaldea');
