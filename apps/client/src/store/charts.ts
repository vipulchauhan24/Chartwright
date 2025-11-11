import { atom } from 'jotai';
import { ConfigSchema } from '../app/charteditor/utils/type';

export const chartTemplates = atom([]);
export const allChartFeatures = atom([]);
export const activeChartFeatures = atom<ConfigSchema>();
export const activeChartConfig = atom<any>();
export const chartTitle = atom<string>('');
export const chartType = atom<'column' | 'bar' | 'line' | 'area'>();
export const chartId = atom<string>('');
export const loadingChartConfig = atom(true);
export const loadingMyCharts = atom(true);

export const userCharts = atom([]);
