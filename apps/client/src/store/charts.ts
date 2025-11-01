import { atom } from 'jotai';
import { ConfigSchema } from '../app/charteditor/utils/type';

export const chartTemplates = atom([]);
export const chartFeatures = atom([]);
export const currentChartGlobalConfig = atom<ConfigSchema>();
export const currentChartConfigStore = atom<any>();
export const chartTitle = atom<string>('');
export const chartId = atom<string>('');
export const loadingChartConfig = atom(true);
export const loadingMyCharts = atom(true);

export const myCharts = atom([]);
