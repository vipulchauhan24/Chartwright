import { useCallback, useMemo } from 'react';
import { DATA_SET_KEY, INPUT_TYPE } from '../utils/enums';
import { useAtom } from 'jotai';
import { chartDataConfigStore, chartGlobalConfig } from '../../../store/charts';
import { alignments, fontWeights, legendPositions } from '../utils/constants';

function useLegend() {
  const [config] = useAtom(chartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(chartDataConfigStore);

  const onLegendPropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY) => {
      if (
        event &&
        key !== DATA_SET_KEY.render &&
        key !== DATA_SET_KEY.showForSingleSeries &&
        key !== DATA_SET_KEY.floating
      ) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.render:
          config.options.legend.show = !config.options.legend.show;
          break;
        case DATA_SET_KEY.showForSingleSeries:
          config.options.legend.showForSingleSeries =
            !config.options.legend.showForSingleSeries;
          break;
        case DATA_SET_KEY.floating:
          config.options.legend.floating = !config.options.legend.floating;
          break;
        case DATA_SET_KEY.position:
          config.options.legend.position = event.target.value;
          break;
        case DATA_SET_KEY.alignment:
          config.options.legend.horizontalAlign = event.target.value;
          break;
        case DATA_SET_KEY.color:
          config.options.legend.labels.colors = event.target.value;
          break;
        case DATA_SET_KEY.fontSize:
          config.options.legend.fontSize = event.target.value;
          break;
        case DATA_SET_KEY.fontWeight:
          config.options.legend.fontWeight = event.target.value;
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

  const legendOptions = useMemo(() => {
    if (!config || !config.globalOptions.legend || !chartDataConfig) {
      return {};
    }

    return {
      id: 'legend-options',
      panelHeading: 'Legend',
      open: true,
      inputsProps: [
        {
          id: 'legend-enabled',
          label: 'Enabled',
          value: chartDataConfig.options.legend.show,
          datasetKey: DATA_SET_KEY.render,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.legend.includes(DATA_SET_KEY.render),
        },
        {
          id: 'legend-single-series',
          label: 'Show for single series',
          value: chartDataConfig.options.legend.showForSingleSeries,
          datasetKey: DATA_SET_KEY.showForSingleSeries,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.legend.includes(
            DATA_SET_KEY.showForSingleSeries
          ),
          hint: 'Make legend visible when there is only single series of data.',
        },
        {
          id: 'legend-floating',
          label: 'Floating',
          value: chartDataConfig.options.legend.floating,
          datasetKey: DATA_SET_KEY.floating,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.legend.includes(DATA_SET_KEY.floating),
          hint: 'Make legend float above chart.',
        },
        {
          id: 'legend-position',
          label: 'Position',
          datasetKey: DATA_SET_KEY.position,
          value: chartDataConfig.options.legend.position,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: legendPositions,
          render: config.globalOptions.legend.includes('position'),
        },
        {
          id: 'legend-alignment',
          label: 'Alignment',
          datasetKey: DATA_SET_KEY.alignment,
          value: chartDataConfig.options.legend.horizontalAlign,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: alignments,
          render: config.globalOptions.legend.includes('alignment'),
        },
        {
          id: 'legend-label-font-size',
          label: 'Font Size',
          datasetKey: DATA_SET_KEY.fontSize,
          value: chartDataConfig.options.legend.fontSize,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.NUMBER,
          render: config.globalOptions.legend.includes('font'),
        },
        {
          id: 'legend-label-font-weight',
          label: 'Font Weight',
          datasetKey: DATA_SET_KEY.fontWeight,
          value: chartDataConfig.options.legend.fontWeight,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: fontWeights,
          render: config.globalOptions.legend.includes('font'),
        },
        {
          id: 'legend-color',
          label: 'Color',
          datasetKey: DATA_SET_KEY.color,
          value: chartDataConfig.options.legend.labels.colors,
          tooltip: 'Only Hex code supported. (#rrggbb)',
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.COLOR,
          render: config.globalOptions.legend.includes(INPUT_TYPE.COLOR),
        },
      ],
    };
  }, [chartDataConfig, config, onLegendPropsUpdate]);

  return [legendOptions];
}

export default useLegend;
