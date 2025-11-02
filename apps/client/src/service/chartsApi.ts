import { atom } from 'jotai';
import axios from 'axios';
import {
  chartTemplates,
  allChartFeatures,
  chartId,
  chartTitle,
  activeChartConfig,
  activeChartFeatures,
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

export const fetchAllChartsFeatures = atom(null, async (_get, set) => {
  try {
    const { data } = await axios.get(API_ENDPOINTS.CHART_FEATURES);
    set(allChartFeatures, data);
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

export const fetchChartConfig = atom(null, async (get, set, chart_id) => {
  try {
    const response = await axios.get(`/api/chart/${chart_id}`);
    const chartConfig = response.data;
    const availableChartGlobalConfigs = get(allChartFeatures);
    for (const idx in availableChartGlobalConfigs) {
      if (
        chartConfig['chart_type'] === availableChartGlobalConfigs[idx]['type']
      ) {
        set(activeChartFeatures, availableChartGlobalConfigs[idx]['config']);
        break;
      }
    }

    set(activeChartConfig, JSON.parse(chartConfig['config']));
    set(chartTitle, chartConfig['title']);
    set(chartId, chartConfig['id']);
  } catch {
    set(activeChartFeatures, undefined);
    set(activeChartConfig, null);
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
    // set(activeChartConfig, JSON.parse(chartConfig['config']));
  } catch {
    set(activeChartConfig, null);
  } finally {
    set(loadingChartConfig, false);
  }
});
