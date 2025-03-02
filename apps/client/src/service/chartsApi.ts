import { atom } from 'jotai';
import axios from 'axios';
import {
  allCharts,
  chartDataConfigStore,
  chartGlobalConfig,
  loadingChartConfig,
} from '../store/charts';

import lineChartFeatureConfig from '../store/jsons/featuresConfig/linechart.json';
import simpleLineChartDataConfig from '../store/jsons/chartDataConfig/simpleLineChart.json';

import columnChartFeatureConfig from '../store/jsons/featuresConfig/columnChart.json';
import simpleColumnChartDataConfig from '../store/jsons/chartDataConfig/simpleColumnChart.json';

import pieChartFeatureConfig from '../store/jsons/featuresConfig/pieChart.json';
import simplePieChartDataConfig from '../store/jsons/chartDataConfig/simplePieChart.json';

import areaChartFeatureConfig from '../store/jsons/featuresConfig/areaChart.json';
import simpleAreaChartDataConfig from '../store/jsons/chartDataConfig/simpleAreaChart.json';

import barChartFeatureConfig from '../store/jsons/featuresConfig/barChart.json';
import simpleBarChartDataConfig from '../store/jsons/chartDataConfig/simpleBarChart.json';

import bubbleChartFeatureConfig from '../store/jsons/featuresConfig/bubbleChart.json';
import simpleBubbleChartDataConfig from '../store/jsons/chartDataConfig/simpleBubbleChart.json';

export const fetchAllChartData = atom(null, async (get, set) => {
  try {
    const response = await axios.get('http://localhost:3000/api/chart-id-all');

    set(allCharts, response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    set(allCharts, []);
  } finally {
    set(loadingChartConfig, false);
  }
});

export const fetchAllChartConfigById = atom(
  null,
  async (get, set, chart_id) => {
    try {
      // const response = await axios.get(
      //   `http://localhost:3000/api/chart-config/${chart_id}`
      // );
      switch (chart_id) {
        case 'simpleBarChart':
          set(chartGlobalConfig, barChartFeatureConfig);
          set(chartDataConfigStore, simpleBarChartDataConfig);
          break;
        case 'simpleColumnChart':
          set(chartGlobalConfig, columnChartFeatureConfig);
          set(chartDataConfigStore, simpleColumnChartDataConfig);
          break;
        case 'simpleLineChart':
          set(chartGlobalConfig, lineChartFeatureConfig);
          set(chartDataConfigStore, simpleLineChartDataConfig);
          break;
        case 'simpleAreaChart':
          set(chartGlobalConfig, areaChartFeatureConfig);
          set(chartDataConfigStore, simpleAreaChartDataConfig);
          break;
        case 'simpleBubbleChart':
          set(chartGlobalConfig, bubbleChartFeatureConfig);
          set(chartDataConfigStore, simpleBubbleChartDataConfig);
          break;
        case 'simplePieChart':
          set(chartGlobalConfig, pieChartFeatureConfig);
          set(chartDataConfigStore, simplePieChartDataConfig);
          break;
        default:
          break;
      }

      // set(chartGlobalConfig, JSON.parse(response.data['base_config']['S']));
    } catch (error) {
      console.error('Error fetching data:', error);
      set(chartGlobalConfig, null);
    } finally {
      set(loadingChartConfig, false);
    }
  }
);
