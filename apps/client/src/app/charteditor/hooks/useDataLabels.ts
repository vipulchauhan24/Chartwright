import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { chartDataConfigStore, chartGlobalConfig } from '../../../store/charts';
import { DATA_SET_KEY, INPUT_TYPE } from '../utils/enums';
import {
  dataLabelsOrientations,
  dataLabelsPositions,
  textAnchors,
} from '../utils/constants';

function useDataLabels() {
  const [config] = useAtom(chartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(chartDataConfigStore);

  const onDataLabelsPropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY, indx?: number) => {
      if (event && key !== DATA_SET_KEY.render) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.render:
          config.options.dataLabels.enabled =
            !config.options.dataLabels.enabled;
          break;
        case DATA_SET_KEY.textAnchor:
          config.options.dataLabels.textAnchor = event.target.value;
          break;
        case DATA_SET_KEY.position:
          config.options.plotOptions.bar.dataLabels.position =
            event.target.value;
          break;
        case DATA_SET_KEY.orientation:
          config.options.plotOptions.bar.dataLabels.orientation =
            event.target.value;
          break;
        case DATA_SET_KEY.fontSize:
          config.options.dataLabels.style.fontSize = event.target.value;
          break;
        case DATA_SET_KEY.color:
          config.options.dataLabels.style.colors[indx || 0] =
            event.target.value;
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

  const dataLabelOptions = useMemo(() => {
    if (!config || !config.globalOptions.dataLabels || !chartDataConfig) {
      return {};
    }

    const dataLabelOptions = {
      id: 'data-labels-options',
      panelHeading: 'Data Labels',
      inputsProps: [
        {
          id: 'data-labels-enabled',
          label: 'Enabled',
          value: chartDataConfig.options.dataLabels.enabled,
          datasetKey: DATA_SET_KEY.render,
          onChange: onDataLabelsPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.dataLabels.includes(DATA_SET_KEY.render),
        },
        {
          id: 'data-labels-alignment',
          label: 'Text Anchor',
          datasetKey: DATA_SET_KEY.textAnchor,
          value: chartDataConfig.options.dataLabels.textAnchor,
          onChange: onDataLabelsPropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: textAnchors,
          render: config.globalOptions.dataLabels.includes(
            DATA_SET_KEY.textAnchor
          ),
        },
        {
          id: 'data-labels-font-size',
          label: 'Font Size',
          datasetKey: DATA_SET_KEY.fontSize,
          value: chartDataConfig.options.dataLabels.style.fontSize,
          onChange: onDataLabelsPropsUpdate,
          type: INPUT_TYPE.NUMBER,
          render: config.globalOptions.dataLabels.includes('font'),
        },
        ...chartDataConfig.options.series.map((_: string, indx: number) => {
          return {
            id: `data-labels-color-${indx}`,
            label: `Color ${indx + 1}`,
            value:
              chartDataConfig.options.dataLabels.style.colors[indx] ||
              chartDataConfig.options.dataLabels.style.colors[0],
            datasetKey: DATA_SET_KEY.color,
            onChange: (event: any, datasetKey: DATA_SET_KEY) => {
              onDataLabelsPropsUpdate(event, datasetKey, indx);
            },
            type: INPUT_TYPE.COLOR,
            render: config.chartOptions.includes(DATA_SET_KEY.color),
          };
        }),
      ],
    };

    if (chartDataConfig.options.plotOptions?.bar.dataLabels.position) {
      dataLabelOptions.inputsProps.push({
        id: 'data-labels-position',
        label: 'Position',
        datasetKey: DATA_SET_KEY.position,
        value: chartDataConfig.options.plotOptions.bar.dataLabels.position,
        onChange: onDataLabelsPropsUpdate,
        type: INPUT_TYPE.SELECT,
        options: dataLabelsPositions,
        render: config.globalOptions.dataLabels.includes(DATA_SET_KEY.position),
      });
    }

    if (chartDataConfig.options.plotOptions?.bar.dataLabels.orientation) {
      dataLabelOptions.inputsProps.push({
        id: 'data-labels-orientation',
        label: 'Orientation',
        datasetKey: DATA_SET_KEY.orientation,
        value: chartDataConfig.options.plotOptions.bar.dataLabels.orientation,
        onChange: onDataLabelsPropsUpdate,
        type: INPUT_TYPE.SELECT,
        options: dataLabelsOrientations,
        render: config.globalOptions.dataLabels.includes(
          DATA_SET_KEY.orientation
        ),
      });
    }

    return dataLabelOptions;
  }, [chartDataConfig, config, onDataLabelsPropsUpdate]);

  return [dataLabelOptions];
}

export default useDataLabels;
