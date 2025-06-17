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
  myCharts,
} from '../store/charts';

export const fetchChartGallery = atom(null, async (get, set) => {
  try {
    const chartGalleryResponse = await axios.get('api/chart-gallery');
    const chartGlobalConfigsResponse = await axios.get(
      '/api/chart-global-configs'
    );
    set(chartGallery, chartGalleryResponse.data);
    set(chartGlobalConfigs, chartGlobalConfigsResponse.data);
  } catch (error) {
    console.error('Error in "fetchChartGallery":', error);
    set(chartGallery, []);
  } finally {
    set(loadingChartConfig, false);
  }
});

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
      set(currentChartGlobalConfig, null);
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
    set(currentChartGlobalConfig, null);
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
  }
});
