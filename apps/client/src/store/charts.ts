import { atom } from 'jotai';
import { ConfigSchema } from '../app/charteditor/utils/type';
import { CHART_TYPES } from '../app/charteditor/utils/lib';

export const chartTemplates = atom([]);
export const allChartFeatures = atom([]);
export const activeChartFeatures = atom<ConfigSchema>();
export const activeChartConfig = atom<any>();
export const chartTitle = atom<string>('');
export const chartType = atom<CHART_TYPES>();
export const chartId = atom<string>('');
export const loadingChartConfig = atom(true);
export const loadingMyCharts = atom(true);
export const userCharts = atom([]);
export const allChartBaseConfig = atom<any>([]);
export const allChartBaseConfigLoading = atom(true);
export const allChartBaseConfigError = atom(false);
