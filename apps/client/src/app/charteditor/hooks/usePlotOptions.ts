import {
  currentChartConfigStore,
  currentChartGlobalConfig,
} from '../../../store/charts';
import { IInputRenderer } from '../containers/inputRenderer';
import { borderRadiusApplications } from '../utils/constants';
import { DATA_SET_KEY, INPUT_TYPE } from '../utils/enums';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

interface IChartPlotOptions {
  id: string;
  panelHeading: string;
  open?: boolean;
  inputsProps: Array<IInputRenderer>;
}

function usePlotOptions() {
  const [config] = useAtom(currentChartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(
    currentChartConfigStore
  );

  const onPlotOptionsPropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY) => {
      if (event && key !== DATA_SET_KEY.horizontal) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.borderRadius:
          config.options.plotOptions.bar.borderRadius = event.target.value;
          break;
        case DATA_SET_KEY.borderRadiusApplication:
          config.options.plotOptions.bar.borderRadiusApplication =
            event.target.value;
          break;
        case DATA_SET_KEY.horizontal:
          config.options.plotOptions.bar.horizontal =
            !config.options.plotOptions.bar.horizontal;
          break;
        case DATA_SET_KEY.barHeight:
          config.options.plotOptions.bar.barHeight = event.target.value + '%';
          break;
        case DATA_SET_KEY.barWidth:
          config.options.plotOptions.bar.columnWidth = event.target.value + '%';
          break;
        default:
          configChanged = false;
          break;
      }

      if (configChanged) {
        setChartDataConfig(config);
      }
    },
    [chartDataConfig, setChartDataConfig]
  );

  const inputPropsForBarChart = useMemo(() => {
    if (
      !chartDataConfig?.options.plotOptions ||
      !chartDataConfig.options.plotOptions.bar
    ) {
      return [];
    }
    return [
      {
        id: 'bar-horizontal',
        label: 'Horizontal',
        value: chartDataConfig.options.plotOptions.bar.horizontal,
        datasetKey: DATA_SET_KEY.horizontal,
        onChange: onPlotOptionsPropsUpdate,
        type: INPUT_TYPE.CHECKBOX,
        render: config.plotOptions.includes(DATA_SET_KEY.horizontal),
      },
      {
        id: 'border-radius',
        label: 'Border Radius',
        value: chartDataConfig.options.plotOptions.bar.borderRadius,
        datasetKey: DATA_SET_KEY.borderRadius,
        onChange: onPlotOptionsPropsUpdate,
        type: INPUT_TYPE.NUMBER,
        render: config.plotOptions.includes(DATA_SET_KEY.borderRadius),
      },
      {
        id: 'border-radius-application',
        label: 'Border Radius Ap.',
        datasetKey: DATA_SET_KEY.borderRadiusApplication,
        value: chartDataConfig.options.plotOptions.bar.borderRadiusApplication,
        onChange: onPlotOptionsPropsUpdate,
        type: INPUT_TYPE.SELECT,
        options: borderRadiusApplications,
        render: config.plotOptions.includes(
          DATA_SET_KEY.borderRadiusApplication
        ),
      },
      {
        id: 'bar-height',
        label: 'Bar Height',
        datasetKey: DATA_SET_KEY.barHeight,
        value: chartDataConfig.options.plotOptions.bar.barHeight,
        onChange: onPlotOptionsPropsUpdate,
        type: INPUT_TYPE.RANGE,
        min: '0',
        max: '99',
        step: '1',
        render: config.plotOptions.includes(DATA_SET_KEY.barHeight),
        disabled: !chartDataConfig.options.plotOptions.bar.horizontal,
        hint: !chartDataConfig.options.plotOptions.bar.horizontal
          ? 'Make chart horizontal to enable.'
          : undefined,
      },
      {
        id: 'bar-width',
        label: 'Bar Width',
        datasetKey: DATA_SET_KEY.barWidth,
        value: chartDataConfig.options.plotOptions.bar.columnWidth,
        onChange: onPlotOptionsPropsUpdate,
        type: INPUT_TYPE.RANGE,
        min: '0',
        max: '100',
        step: '1',
        render: config.plotOptions.includes(DATA_SET_KEY.barWidth),
        disabled: chartDataConfig.options.plotOptions.bar.horizontal,
        hint:
          chartDataConfig.options.plotOptions.bar.horizontal &&
          'Make chart vertical to enable.',
      },
    ];
  }, [chartDataConfig, config, onPlotOptionsPropsUpdate]);

  const plotOptions: any = useMemo(() => {
    if (!config || !config.globalOptions.dataLabels || !chartDataConfig) {
      return {};
    }

    const plotOption: IChartPlotOptions = {
      id: 'plot-options',
      panelHeading: 'Plot Options',
      inputsProps: [],
    };

    switch (chartDataConfig.options.chart.type) {
      case 'bar':
        plotOption.inputsProps = inputPropsForBarChart;
        break;

      default:
        plotOption.inputsProps = [];
        break;
    }
    return plotOption;
  }, [chartDataConfig, config, inputPropsForBarChart]);

  return [plotOptions];
}

export default usePlotOptions;
