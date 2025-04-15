import { atom } from 'jotai';

export const chartGallery = atom([]);
export const chartGlobalConfigs = atom([]);
export const currentChartGlobalConfig = atom<any>();
export const currentChartConfigStore = atom<any>();
export const chartTitle = atom<string>('');
export const loadingChartConfig = atom(true);
