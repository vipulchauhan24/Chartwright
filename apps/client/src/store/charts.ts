import { atom } from 'jotai';

const gconfig = {
  globalOptions: {
    legend: ['visible', 'position', 'alignment', 'color', 'font'],
    title: ['visible', 'text', 'alignment', 'color', 'font'],
    subtitle: ['visible', 'text', 'alignment', 'color', 'font'],
    grid: ['visible', 'xaxis', 'yaxis'],
    // xAxis: ['visible', 'gridOffset'],
    // yAxis: ['visible', 'gridOffset'],
    others: ['background'],
  },
  chartOptions: ['label', 'data'],
};

const chartDataConfigl = {
  type: 'line',
  series: [
    {
      name: 'Series 1',
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
    {
      name: 'Series 2',
      data: [23, 42, 35, 27, 43, 52, 61, 75, 90],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ['#77B6EA', '#545454'],
    stroke: {
      curve: 'straight',
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
      ],
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
    },
    title: {
      show: true,
      text: 'Chart title',
      align: 'left',
      // margin: 10,
      // offsetX: 0,
      // offsetY: 0,
      // floating: false,
      style: {
        fontSize: '14px',
        // fontWeight: 'bold',
        // fontFamily: undefined,
        // color: '#263238',
      },
    },
    subtitle: {
      show: true,
      text: 'Chart subtitle',
      align: 'left',
      // margin: 10,
      // offsetX: 0,
      // offsetY: 0,
      // floating: false,
      style: {
        fontSize: '12px',
        // fontWeight: 'normal',
        // fontFamily: undefined,
        // color: '#9699a2',
      },
    },
    grid: {
      show: true,
      // borderColor: '#90A4AE',
      // strokeDashArray: 0,
      // position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      // row: {
      //   colors: undefined,
      //   opacity: 0.5,
      // },
      // column: {
      //   colors: undefined,
      //   opacity: 0.5,
      // },
      // padding: {
      //   top: 0,
      //   right: 0,
      //   bottom: 0,
      //   left: 0,
      // },
    },
    tooltip: {
      enabled: true,
    },
  },
};

export const allCharts = atom([]);
export const chartGlobalConfig = atom<any>(gconfig);
export const chartDataConfigStore = atom<any>(chartDataConfigl);
export const loadingChartConfig = atom(true);
