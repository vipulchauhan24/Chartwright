import { chartDataConfigStore, chartGlobalConfig } from '../../../store/charts';
import { borderRadiusApplications } from '../utils/constants';
import { DATA_SET_KEY, INPUT_TYPE } from '../utils/enums';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

function usePlotOptions() {
  const [config] = useAtom(chartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(chartDataConfigStore);

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

  const plotOptions = useMemo(() => {
    if (!config || !config.globalOptions.dataLabels || !chartDataConfig) {
      return {};
    }

    return {
      id: 'plot-options',
      panelHeading: 'Plot Options',
      inputsProps: [
        {
          id: 'bar-horizontal',
          label: 'Horizontal',
          value: chartDataConfig.options.plotOptions.bar.horizontal,
          datasetKey: DATA_SET_KEY.horizontal,
          onChange: onPlotOptionsPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          enabled: config.plotOptions.includes(DATA_SET_KEY.horizontal),
        },
        {
          id: 'border-radius',
          label: 'Border Radius',
          value: chartDataConfig.options.plotOptions.bar.borderRadius,
          datasetKey: DATA_SET_KEY.borderRadius,
          onChange: onPlotOptionsPropsUpdate,
          type: INPUT_TYPE.NUMBER,
          enabled: config.plotOptions.includes(DATA_SET_KEY.borderRadius),
        },
        {
          id: 'border-radius-application',
          label: 'Border Radius Ap.',
          datasetKey: DATA_SET_KEY.borderRadiusApplication,
          value:
            chartDataConfig.options.plotOptions.bar.borderRadiusApplication,
          onChange: onPlotOptionsPropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: borderRadiusApplications,
          enabled: config.plotOptions.includes(
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
          max: '100',
          step: '1',
          enabled: config.plotOptions.includes(DATA_SET_KEY.barHeight),
        },
      ],
    };
  }, [chartDataConfig, config, onPlotOptionsPropsUpdate]);

  return [plotOptions];
}

export default usePlotOptions;
