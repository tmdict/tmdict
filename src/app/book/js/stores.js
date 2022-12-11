import { writable } from 'svelte/store';

export const activeLang = writable(localStorage.getItem('tmdict.book.lang') || 'en');
export const currentSource = writable('toc');
