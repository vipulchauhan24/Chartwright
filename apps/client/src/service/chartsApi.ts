import { atom } from 'jotai';
import axios from 'axios';
import {
  chartTemplates,
  chartFeatures,
  chartId,
  chartTitle,
  currentChartConfigStore,
  currentChartGlobalConfig,
  loadingChartConfig,
  loadingMyCharts,
  myCharts,
} from '../store/charts';
import { API_ENDPOINTS } from '../app/charteditor/utils/constants';

export const fetchChartTemplates = atom(null, async (_get, set) => {
  try {
    const { data } = await axios.get(API_ENDPOINTS.CHART_TEMPLATE);
    set(chartTemplates, data);
  } catch (error) {
    console.error('Error in "fetchChartTemplates":', error);
  }
});

export const fetchChartFeatures = atom(null, async (_get, set) => {
  try {
    const { data } = await axios.get(API_ENDPOINTS.CHART_FEATURES);
    set(chartFeatures, data);
  } catch (error) {
    console.error('Error in "fetchChartFeatures":', error);
  } finally {
    set(loadingChartConfig, false);
  }
});

export const getChartBaseConfig = atom(null, async (_get, _set, type) => {
  try {
    const { data } = await axios.get(
      `${API_ENDPOINTS.CHART_BASE_CONFIG}/${type}`
    );
    return JSON.parse(data.config);
  } catch (error) {
    console.error('Error in "getChartBaseConfig":', error);
  }
});

export const setInitChartData = atom(null, async (get, set, chartType) => {
  try {
    const chartTemplatesData = get(chartTemplates);
    const availableChartGlobalConfigs = get(chartFeatures);
    for (const indx in chartTemplatesData) {
      const chartMatchPattern = String(chartTemplatesData[indx]['title'])
        .toLowerCase()
        .split(' ')
        .join('-');
      if (chartMatchPattern === chartType) {
        for (const idx in availableChartGlobalConfigs) {
          if (
            chartTemplatesData[indx]['chart_type'] ===
            availableChartGlobalConfigs[idx]['type']
          ) {
            set(
              currentChartGlobalConfig,
              availableChartGlobalConfigs[idx]['config']
            );
          }
        }

        set(
          currentChartConfigStore,
          JSON.parse(chartTemplatesData[indx]['config'])
        );
        set(chartTitle, chartTemplatesData[indx]['title']);
        set(chartId, chartTemplatesData[indx]['id']);
        break;
      }
    }
  } catch (error) {
    console.error('Error in "setInitChartData":', error);
    set(currentChartGlobalConfig, undefined);
    set(currentChartConfigStore, null);
    set(chartTitle, '');
    set(chartId, '');
  } finally {
    set(loadingChartConfig, false);
  }
});

export const fetchChartConfig = atom(null, async (get, set, chart_id) => {
  try {
    const response = await axios.get(`/api/chart/${chart_id}`);
    const chartConfig = response.data;
    const availableChartGlobalConfigs = get(chartFeatures);
    for (const idx in availableChartGlobalConfigs) {
      if (
        chartConfig['chart_type'] === availableChartGlobalConfigs[idx]['type']
      ) {
        set(
          currentChartGlobalConfig,
          availableChartGlobalConfigs[idx]['config']
        );
        break;
      }
    }

    set(currentChartConfigStore, JSON.parse(chartConfig['config']));
    set(chartTitle, chartConfig['title']);
    set(chartId, chartConfig['id']);
  } catch {
    set(currentChartGlobalConfig, undefined);
    set(currentChartConfigStore, null);
    set(chartTitle, '');
    set(chartId, '');
  } finally {
    set(loadingChartConfig, false);
  }
});

export const fetchMyCharts = atom(null, async (get, set, userId) => {
  try {
    const response = await axios.get(`/api/my-charts/${userId}`);
    set(myCharts, response.data);
  } catch {
    set(myCharts, []);
  } finally {
    set(loadingMyCharts, false);
  }
});

export const fetchEmbedChartConfig = atom(null, async (get, set, embedId) => {
  try {
    const response = await axios.get(`/api/embed-config/${embedId}`);
    const chartConfig = response.data;
    // set(currentChartConfigStore, JSON.parse(chartConfig['config']));
  } catch {
    set(currentChartConfigStore, null);
  } finally {
    set(loadingChartConfig, false);
  }
});
