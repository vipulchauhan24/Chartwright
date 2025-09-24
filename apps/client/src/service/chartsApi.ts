import { atom } from 'jotai';
import axios from 'axios';
import {
  chartGallery,
  chartGlobalConfigs,
  chartId,
  chartTitle,
  currentChartConfigStore,
  currentChartGlobalConfig,
  loadingChartConfig,
  loadingMyCharts,
  myCharts,
} from '../store/charts';
import { API_ENDPOINTS } from '../app/charteditor/utils/constants';

export const fetchChartGallery = atom(null, async (get, set) => {
  try {
    const { data } = await axios.get(API_ENDPOINTS.CHART_GALLERY);
    set(chartGallery, data);
  } catch (error) {
    console.error('Error in "fetchChartGallery":', error);
  }
});

export const fetchChartGlobalOptions = atom(null, async (get, set) => {
  try {
    const { data } = await axios.get(API_ENDPOINTS.CHART_GLOBAL_CONFIGS);
    set(chartGlobalConfigs, data);
  } catch (error) {
    console.error('Error in "fetchChartGlobalOptions":', error);
  } finally {
    set(loadingChartConfig, false);
  }
});

export const getChartDefaultConfigByType = atom(
  null,
  async (get, set, type) => {
    try {
      const { data } = await axios.get(
        `${API_ENDPOINTS.CHART_DEFAULT_CONFIG}/${type}`
      );
      return JSON.parse(data.config);
    } catch (error) {
      console.error('Error in "getChartDefaultConfigByType":', error);
    }
  }
);

export const setDefaultChartConfig = atom(
  null,
  async (get, set, chartMatchId) => {
    try {
      const availableDefaultCharts = get(chartGallery);
      const availableChartGlobalConfigs = get(chartGlobalConfigs);
      for (const indx in availableDefaultCharts) {
        const chartMatchPattern = String(availableDefaultCharts[indx]['title'])
          .toLowerCase()
          .split(' ')
          .join('-');
        if (chartMatchPattern === chartMatchId) {
          for (const idx in availableChartGlobalConfigs) {
            if (
              availableDefaultCharts[indx]['chart_type'] ===
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
            JSON.parse(availableDefaultCharts[indx]['config'])
          );
          set(chartTitle, availableDefaultCharts[indx]['title']);
          set(chartId, availableDefaultCharts[indx]['id']);
          break;
        }
      }
    } catch (error) {
      console.error('Error in "setDefaultChartConfig":', error);
      set(currentChartGlobalConfig, undefined);
      set(currentChartConfigStore, null);
      set(chartTitle, '');
      set(chartId, '');
    } finally {
      set(loadingChartConfig, false);
    }
  }
);

export const fetchChartConfig = atom(null, async (get, set, chart_id) => {
  try {
    const response = await axios.get(`/api/chart/${chart_id}`);
    const chartConfig = response.data;
    const availableChartGlobalConfigs = get(chartGlobalConfigs);
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
