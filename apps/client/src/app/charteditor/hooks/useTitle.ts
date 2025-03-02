import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { chartDataConfigStore, chartGlobalConfig } from '../../../store/charts';
import { DATA_SET_KEY, INPUT_TYPE } from '../utils/enums';
import { alignments, fontFamilies, fontWeights } from '../utils/constants';

function useTitle() {
  const [config] = useAtom(chartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(chartDataConfigStore);

  const onTitlePropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY) => {
      if (event && key !== DATA_SET_KEY.floating) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.position:
          config.options.title.position = event.target.value;
          break;
        case DATA_SET_KEY.alignment:
          config.options.title.align = event.target.value;
          break;
        case DATA_SET_KEY.color:
          config.options.title.style.color = event.target.value;
          break;
        case DATA_SET_KEY.fontSize:
          config.options.title.style.fontSize = event.target.value;
          break;
        case DATA_SET_KEY.fontWeight:
          config.options.title.style.fontWeight = event.target.value;
          break;
        case DATA_SET_KEY.fontFamily:
          config.options.title.style.fontFamily = event.target.value;
          break;
        case DATA_SET_KEY.data:
          config.options.title.text = event.target.value;
          break;
        case DATA_SET_KEY.floating:
          config.options.title.floating = !config.options.title.floating;
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

  const titleOptions = useMemo(() => {
    if (!config || !config.globalOptions.title || !chartDataConfig) {
      return {};
    }
    return {
      id: 'title-options',
      panelHeading: 'Title',
      open: true,
      inputsProps: [
        {
          id: 'title-text',
          label: 'Text',
          datasetKey: DATA_SET_KEY.data,
          value: chartDataConfig.options.title.text,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.TEXT,
          placeholder: 'Enter text here...',
          render: config.globalOptions.title.includes(INPUT_TYPE.TEXT),
          hint: 'Clear text input on right to disable chart title.',
        },
        {
          id: 'title-floating',
          label: 'Floating',
          value: chartDataConfig.options.title.floating,
          datasetKey: DATA_SET_KEY.floating,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.legend.includes(DATA_SET_KEY.floating),
          hint: 'Make title float above chart.',
        },
        {
          id: 'title-alignment',
          label: 'Alignment',
          datasetKey: DATA_SET_KEY.alignment,
          value: chartDataConfig.options.title.align,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: alignments,
          render: config.globalOptions.title.includes('alignment'),
        },
        {
          id: 'title-font-size',
          label: 'Font Size',
          datasetKey: DATA_SET_KEY.fontSize,
          value: chartDataConfig.options.title.style.fontSize,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.NUMBER,
          render: config.globalOptions.title.includes('font'),
        },
        {
          id: 'title-font-weight',
          label: 'Font Weight',
          datasetKey: DATA_SET_KEY.fontWeight,
          value: chartDataConfig.options.title.style.fontWeight,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: fontWeights,
          render: config.globalOptions.title.includes('font'),
        },
        {
          id: 'title-font-family',
          label: 'Font Family',
          datasetKey: DATA_SET_KEY.fontFamily,
          value: chartDataConfig.options.title.style.fontFamily,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: fontFamilies,
          render: config.globalOptions.legend.includes('font'),
        },
        {
          id: 'title-color',
          label: 'Color',
          datasetKey: DATA_SET_KEY.color,
          value: chartDataConfig.options.title.style.color,
          tooltip: 'Only Hex code supported. (#rrggbb)',
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.COLOR,
          render: config.globalOptions.title.includes(INPUT_TYPE.COLOR),
        },
      ],
    };
  }, [chartDataConfig, config, onTitlePropsUpdate]);

  return [titleOptions];
}

export default useTitle;
