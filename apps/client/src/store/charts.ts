import { atom } from 'jotai';
import { ConfigSchema } from '../app/charteditor/utils/type';

export const chartGallery = atom([]);
export const chartGlobalConfigs = atom([]);
export const currentChartGlobalConfig = atom<ConfigSchema>();
export const currentChartConfigStore = atom<any>();
export const chartTitle = atom<string>('');
export const chartId = atom<string>('');
export const loadingChartConfig = atom(true);

export const myCharts = atom([]);
