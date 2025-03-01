import { atom } from 'jotai';
// import lineChartFeatureConfig from './jsons/featuresConfig/linechart.json';
// import simpleLineChartDataConfig from './jsons/chartDataConfig/simpleLineChart.json';

// import columnChartFeatureConfig from './jsons/featuresConfig/columnChart.json';
// import simpleColumnChartDataConfig from './jsons/chartDataConfig/simpleColumnChart.json';

// import pieChartFeatureConfig from './jsons/featuresConfig/pieChart.json';
// import simplePieChartDataConfig from './jsons/chartDataConfig/simplePieChart.json';

// import areaChartFeatureConfig from './jsons/featuresConfig/areaChart.json';
// import simpleAreaChartDataConfig from './jsons/chartDataConfig/simpleAreaChart.json';

import barChartFeatureConfig from './jsons/featuresConfig/barChart.json';
import simpleBarChartDataConfig from './jsons/chartDataConfig/simpleBarChart.json';

// import bubbleChartFeatureConfig from './jsons/featuresConfig/bubbleChart.json';
// import simpleBubbleChartDataConfig from './jsons/chartDataConfig/simpleBubbleChart.json';

// const gconfig = lineChartFeatureConfig;
// const chartDataConfigl = simpleLineChartDataConfig;

// const gconfig = columnChartFeatureConfig;
// const chartDataConfigl = simpleColumnChartDataConfig;

// const gconfig = pieChartFeatureConfig;
// const chartDataConfigl = simplePieChartDataConfig;

// const gconfig = areaChartFeatureConfig;
// const chartDataConfigl = simpleAreaChartDataConfig;

const gconfig = barChartFeatureConfig;
const chartDataConfigl = simpleBarChartDataConfig;

// const gconfig = bubbleChartFeatureConfig;
// const chartDataConfigl = simpleBubbleChartDataConfig;

export const allCharts = atom([]);
export const chartGlobalConfig = atom<any>(gconfig);
export const chartDataConfigStore = atom<any>(chartDataConfigl);
export const loadingChartConfig = atom(true);
