import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import {
  currentChartConfigStore,
  currentChartGlobalConfig,
} from '../../../store/charts';
import { DATA_SET_KEY, INPUT_TYPE } from '../utils/enums';
import { alignments, fontFamilies, fontWeights } from '../utils/constants';

function useSubTitle() {
  const [config] = useAtom(currentChartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(
    currentChartConfigStore
  );

  const onSubtitlePropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY) => {
      if (event && key !== DATA_SET_KEY.floating) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.alignment:
          config.options.subtitle.align = event.target.value;
          break;
        case DATA_SET_KEY.color:
          config.options.subtitle.style.color = event.target.value;
          break;
        case DATA_SET_KEY.fontSize:
          config.options.subtitle.style.fontSize = event.target.value;
          break;
        case DATA_SET_KEY.fontWeight:
          config.options.subtitle.style.fontWeight = event.target.value;
          break;
        case DATA_SET_KEY.fontFamily:
          config.options.subtitle.style.fontFamily = event.target.value;
          break;
        case DATA_SET_KEY.data:
          config.options.subtitle.text = event.target.value;
          break;
        case DATA_SET_KEY.floating:
          config.options.subtitle.floating = !config.options.subtitle.floating;
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

  const subtitleOptions = useMemo(() => {
    if (!config || !config.globalOptions.subtitle || !chartDataConfig) {
      return {};
    }
    return {
      id: 'subtitle-options',
      panelHeading: 'Subtitle',
      inputsProps: [
        {
          id: 'subtitle-text',
          label: 'Text',
          datasetKey: DATA_SET_KEY.data,
          value: chartDataConfig.options.subtitle.text,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.TEXT,
          placeholder: 'Enter text here...',
          render: config.globalOptions.subtitle.includes(INPUT_TYPE.TEXT),
          hint: 'Clear text input on right to disable chart subtitle.',
        },
        {
          id: 'subtitle-floating',
          label: 'Floating',
          value: chartDataConfig.options.subtitle.floating,
          datasetKey: DATA_SET_KEY.floating,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.legend.includes(DATA_SET_KEY.floating),
          hint: 'Make subtitle float above chart.',
        },
        {
          id: 'subtitle-alignment',
          label: 'Alignment',
          datasetKey: DATA_SET_KEY.alignment,
          value: chartDataConfig.options.subtitle.align,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: alignments,
          render: config.globalOptions.subtitle.includes('alignment'),
        },
        {
          id: 'subtitle-font-size',
          label: 'Font Size',
          datasetKey: DATA_SET_KEY.fontSize,
          value: chartDataConfig.options.subtitle.style.fontSize,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.NUMBER,
          render: config.globalOptions.subtitle.includes('font'),
        },
        {
          id: 'subtitle-font-weight',
          label: 'Font Weight',
          datasetKey: DATA_SET_KEY.fontWeight,
          value: chartDataConfig.options.subtitle.style.fontWeight,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: fontWeights,
          render: config.globalOptions.subtitle.includes('font'),
        },
        {
          id: 'subtitle-font-family',
          label: 'Font Family',
          datasetKey: DATA_SET_KEY.fontFamily,
          value: chartDataConfig.options.subtitle.style.fontFamily,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: fontFamilies,
          render: config.globalOptions.legend.includes('font'),
        },
        {
          id: 'subtitle-color',
          label: 'Color',
          datasetKey: DATA_SET_KEY.color,
          value: chartDataConfig.options.subtitle.style.color,
          tooltip: 'Only Hex code supported. (#rrggbb)',
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.COLOR,
          render: config.globalOptions.subtitle.includes(INPUT_TYPE.COLOR),
        },
      ],
    };
  }, [chartDataConfig, config, onSubtitlePropsUpdate]);

  return [subtitleOptions];
}

export default useSubTitle;
