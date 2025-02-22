import { atom } from 'jotai';
import axios from 'axios';
import {
  allCharts,
  chartGlobalConfig,
  loadingChartConfig,
} from '../store/charts';

export const fetchAllChartData = atom(null, async (get, set) => {
  try {
    const response = await axios.get('http://localhost:3000/api/chart-id-all');

    set(allCharts, response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    set(allCharts, []);
  }
});

export const fetchAllChartConfigById = atom(
  null,
  async (get, set, chart_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/chart-config/${chart_id}`
      );

      set(chartGlobalConfig, JSON.parse(response.data['base_config']['S']));
    } catch (error) {
      console.error('Error fetching data:', error);
      set(chartGlobalConfig, null);
    } finally {
      set(loadingChartConfig, false);
    }
  }
);
