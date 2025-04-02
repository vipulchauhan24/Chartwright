import { atom } from 'jotai';
import axios from 'axios';
import {
  chartGallery,
  chartGlobalConfigs,
  currentChartConfigStore,
  currentChartGlobalConfig,
  loadingChartConfig,
} from '../store/charts';

export const fetchChartGallery = atom(null, async (get, set) => {
  try {
    const chartGalleryResponse = await axios.get('api/chart-gallery');
    const chartGlobalConfigsResponse = await axios.get(
      'api/chart-global-configs'
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

export const fetchChartDataById = atom(null, async (get, set, chart_id) => {
  try {
    const response = await axios.get(`/api/chart-config/${chart_id}`);
    // switch (chart_id) {
    //   case 'simpleBarChart':
    //     set(chartGlobalConfig, barChartFeatureConfig);
    //     set(chartDataConfigStore, simpleBarChartDataConfig);
    //     break;
    //   case 'simpleColumnChart':
    //     set(chartGlobalConfig, columnChartFeatureConfig);
    //     set(chartDataConfigStore, simpleColumnChartDataConfig);
    //     break;
    //   case 'simpleLineChart':
    //     set(chartGlobalConfig, lineChartFeatureConfig);
    //     set(chartDataConfigStore, simpleLineChartDataConfig);
    //     break;
    //   case 'simpleAreaChart':
    //     set(chartGlobalConfig, areaChartFeatureConfig);
    //     set(chartDataConfigStore, simpleAreaChartDataConfig);
    //     break;
    //   case 'simpleBubbleChart':
    //     set(chartGlobalConfig, bubbleChartFeatureConfig);
    //     set(chartDataConfigStore, simpleBubbleChartDataConfig);
    //     break;
    //   case 'simplePieChart':
    //     set(chartGlobalConfig, pieChartFeatureConfig);
    //     set(chartDataConfigStore, simplePieChartDataConfig);
    //     break;
    //   default:
    //     break;
    // }

    set(currentChartConfigStore, JSON.parse(response.data['config']));
  } catch (error) {
    console.error('Error in "fetchChartDataById":', error);
    set(currentChartConfigStore, null);
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
          return;
        }
      }
    } catch (error) {
      console.error('Error in "setDefaultChartConfig":', error);
      set(currentChartGlobalConfig, null);
      set(currentChartConfigStore, null);
    } finally {
      set(loadingChartConfig, false);
    }
  }
);
