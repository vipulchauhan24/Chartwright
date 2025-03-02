import { atom } from 'jotai';

export const allCharts = atom([]);
export const chartGlobalConfig = atom<any>();
export const chartDataConfigStore = atom<any>();
export const loadingChartConfig = atom(true);
