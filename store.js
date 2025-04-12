import { atom } from 'jotai';

export const favouritesAtom = atom([]);
export const searchHistoryAtom = atom([]);
export const favouritesLoadingAtom = atom(true);
export const historyLoadingAtom = atom(true);