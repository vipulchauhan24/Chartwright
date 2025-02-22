import { atom } from 'jotai';

export const allCharts = atom([]);
export const chartGlobalConfig = atom<any>(null);
export const loadingChartConfig = atom(true);
