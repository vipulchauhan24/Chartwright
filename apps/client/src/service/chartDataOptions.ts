import { IInputRenderer } from '../app/charteditor/containers/inputRenderer';
import { DATA_SET_KEY, INPUT_TYPE } from '../app/charteditor/utils/enums';

interface IChartDataOptions {
  id: string;
  panelHeading: string;
  open?: boolean;
  inputsProps: Array<IInputRenderer>;
}

export const generateBarAndLineChartDataOptions = (
  config: any,
  chartDataConfig: any,
  onChartDataOptionsUpdate: (
    event: any,
    datasetKey: DATA_SET_KEY,
    indx: number
  ) => void
) => {
  const options: Array<IChartDataOptions> = [];
  chartDataConfig.options.series.forEach(
    (series: { name: string; data: Array<string> }, indx: number) => {
      const opts = {
        id: `chart-data-editor-acc-${indx}`,
        panelHeading: `${series.name}`,
        open: indx === 0,
        inputsProps: [
          {
            id: `edit-chart-series-name-${indx}`,
            label: 'Name',
            value: series.name,
            datasetKey: DATA_SET_KEY.label,
            onChange: (event: any, datasetKey: DATA_SET_KEY) => {
              onChartDataOptionsUpdate(event, datasetKey, indx);
            },
            type: INPUT_TYPE.TEXT,
            render: config.chartOptions.includes(DATA_SET_KEY.label),
          },
          {
            id: `edit-chart-data-${indx}`,
            label: 'Data',
            value: series.data.join(','),
            datasetKey: DATA_SET_KEY.data,
            onChange: (event: any, datasetKey: DATA_SET_KEY) => {
              onChartDataOptionsUpdate(event, datasetKey, indx);
            },
            type: INPUT_TYPE.TEXT_AREA,
            render: config.chartOptions.includes(DATA_SET_KEY.data),
          },
          {
            id: `edit-chart-color-${indx}`,
            label: 'Background Color',
            value: chartDataConfig.options.colors[indx],
            datasetKey: DATA_SET_KEY.color,
            onChange: (event: any, datasetKey: DATA_SET_KEY) => {
              onChartDataOptionsUpdate(event, datasetKey, indx);
            },
            type: INPUT_TYPE.COLOR,
            render: config.chartOptions.includes(DATA_SET_KEY.color),
          },
        ],
      };
      options.push(opts);
    }
  );
  return options;
};

export const generatePieChartDataOptions = (
  config: any,
  chartDataConfig: any,
  onChartDataOptionsUpdate: (
    event: any,
    datasetKey: DATA_SET_KEY,
    indx: number
  ) => void
) => {
  return [
    {
      id: `chart-data-editor-acc-pie-chart`,
      panelHeading: 'Pie Chart Data',
      open: true,
      inputsProps: [
        {
          id: `edit-pie-chart-data`,
          label: 'Data',
          value: chartDataConfig.options.series.join(','),
          datasetKey: DATA_SET_KEY.data,
          onChange: (event: any, datasetKey: DATA_SET_KEY) => {
            onChartDataOptionsUpdate(event, datasetKey, 0);
          },
          type: INPUT_TYPE.TEXT_AREA,
          render: config.chartOptions.includes(DATA_SET_KEY.data),
        },
        ...chartDataConfig.options.series.map((_: string, indx: number) => {
          return {
            id: `edit-pie-chart-color-${indx}`,
            label: `Background Color ${indx + 1}`,
            value:
              chartDataConfig.options.colors[indx] ||
              chartDataConfig.options.colors[0],
            datasetKey: DATA_SET_KEY.color,
            onChange: (event: any, datasetKey: DATA_SET_KEY) => {
              onChartDataOptionsUpdate(event, datasetKey, indx);
            },
            type: INPUT_TYPE.COLOR,
            render: config.chartOptions.includes(DATA_SET_KEY.color),
          };
        }),
      ],
    },
  ];
};

export const generateBubbleChartDataOptions = (
  config: any,
  chartDataConfig: any,
  onChartDataOptionsUpdate: (
    data: Array<Array<number>> | string,
    datasetKey: DATA_SET_KEY,
    indx: number
  ) => void
) => {
  return [
    ...chartDataConfig.options.series.map(
      (series: { name: string; data: Array<string> }, indx: number) => {
        return {
          id: `chart-data-editor-acc-${indx}`,
          panelHeading: `${series.name}`,
          open: indx === 0,
          inputsProps: [
            {
              id: `edit-chart-data-${indx}`,
              label: 'Data',
              value: series.data,
              datasetKey: DATA_SET_KEY.data,
              onChange: (
                data: Array<Array<number>>,
                datasetKey: DATA_SET_KEY
              ) => {
                onChartDataOptionsUpdate(data, datasetKey, indx);
              },
              type: INPUT_TYPE.TABLE,
              render: config.chartOptions.includes(DATA_SET_KEY.data),
            },
            ,
            {
              id: `edit-chart-color-${indx}`,
              label: 'Background Color',
              value: chartDataConfig.options.colors[indx],
              datasetKey: DATA_SET_KEY.color,
              onChange: (event: any, datasetKey: DATA_SET_KEY) => {
                onChartDataOptionsUpdate(event, datasetKey, indx);
              },
              type: INPUT_TYPE.COLOR,
              render: config.chartOptions.includes(DATA_SET_KEY.color),
            },
          ],
        };
      }
    ),
  ];
};
