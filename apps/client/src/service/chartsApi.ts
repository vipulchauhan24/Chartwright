import { atom } from 'jotai';
import {
  chartTemplates,
  allChartFeatures,
  chartId,
  chartTitle,
  activeChartConfig,
  activeChartFeatures,
  loadingChartConfig,
  loadingUserCharts,
  userCharts,
  chartType,
  allChartBaseConfig,
  allChartBaseConfigLoading,
  allChartBaseConfigError,
  loadingActiveUserChart,
} from '../store/charts';
import { API_ENDPOINTS } from '../app/charteditor/utils/constants';
import { api } from '../app/api-client';

export const fetchChartTemplates = atom(null, async (_get, set) => {
  try {
    const { data } = await api.instance.get(API_ENDPOINTS.CHART_TEMPLATE);
    set(chartTemplates, data);
  } catch (error) {
    console.error('Error in "fetchChartTemplates":', error);
  }
});

export const fetchAllChartsFeatures = atom(null, async (_get, set) => {
  try {
    const { data } = await api.instance.get(API_ENDPOINTS.CHART_FEATURES);
    set(allChartFeatures, data);
  } catch (error) {
    console.error('Error in "fetchChartFeatures":', error);
  } finally {
    set(loadingChartConfig, false);
  }
});

export const fetchAllUserCharts = atom(null, async (_get, set) => {
  try {
    const response = await api.instance.get(
      `${API_ENDPOINTS.USER_CHARTS}/all/charts`
    );
    set(userCharts, response.data);
  } catch {
    set(userCharts, []);
  } finally {
    set(loadingUserCharts, false);
  }
});

export const fetchUserChartById = atom(null, async (get, set, userChartId) => {
  try {
    set(loadingActiveUserChart, true);
    const response = await api.instance.get(
      `${API_ENDPOINTS.USER_CHARTS}/${userChartId}`
    );
    const userChart = response.data;
    const chartFeatures = get(allChartFeatures);
    for (const idx in chartFeatures) {
      if (userChart['chartType'] === chartFeatures[idx]['type']) {
        set(activeChartFeatures, chartFeatures[idx]['config']);
        break;
      }
    }

    set(activeChartConfig, userChart['config']);
    set(chartTitle, userChart['title']);
    set(chartType, userChart['chartType']);
    set(chartId, userChart['id']);
  } catch (error) {
    console.error('Error in "fetchUserChartById":', error);
    set(activeChartFeatures, undefined);
    set(activeChartConfig, null);
    set(chartTitle, '');
    set(chartId, '');
  } finally {
    set(loadingActiveUserChart, false);
  }
});

export const fetchAllChartBaseConfig = atom(null, async (_get, set) => {
  try {
    const { data } = await api.instance.get(API_ENDPOINTS.CHART_BASE_CONFIG);
    set(allChartBaseConfig, data);
  } catch (error) {
    console.error('Error in "fetchAllChartBaseConfig":', error);
    set(allChartBaseConfigError, true);
  } finally {
    set(allChartBaseConfigLoading, false);
  }
});

export const fetchEmbedChartConfig = atom(null, async (get, set, embedId) => {
  try {
    const response = await api.instance.get(`/api/embed-config/${embedId}`);
    const chartConfig = response.data;
    // set(activeChartConfig, JSON.parse(chartConfig['config']));
  } catch {
    set(activeChartConfig, null);
  } finally {
    set(loadingChartConfig, false);
  }
});
