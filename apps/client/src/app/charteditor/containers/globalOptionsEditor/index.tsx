import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  chartDataConfigStore,
  chartGlobalConfig,
} from '../../../../store/charts';
import { CHART_FEATURE, DATA_SET_KEY, INPUT_TYPE } from '../../utils/enums';
import { alignments } from '../../utils/constants';
import CWAccordian from '../../../components/accordian';
import InputRenderer, { IInputRenderer } from '../inputRenderer';
import useDataLabels from '../../hooks/useDataLabels';
import useLegend from '../../hooks/useLegend';
import useTitle from '../../hooks/useTitle';

interface IChartGlobalOptions {
  id: string;
  panelHeading: string;
  open?: boolean;
  inputsProps: Array<IInputRenderer>;
}

function GlobalOptionsEditor() {
  const [config] = useAtom(chartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(chartDataConfigStore);
  const [globalOptions, setGlobalOptions] = useState<
    Array<IChartGlobalOptions>
  >([]);
  const [dataLabelOptions] = useDataLabels();
  const [legendOptions] = useLegend();
  const [titleOptions] = useTitle();

  const onSubtitlePropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY) => {
      if (event) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.alignment:
          config.options.subtitle.align = event.target.value;
          break;
        // case DATA_SET_KEY.color:
        //   config.options.plugins.subtitle.color = event.target.value;
        //   break;
        case DATA_SET_KEY.fontSize:
          config.options.subtitle.style.fontSize = event.target.value;
          break;
        case DATA_SET_KEY.data:
          config.options.subtitle.text = event.target.value;
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
          id: 'subtitle-alignment',
          label: 'Alignment',
          datasetKey: DATA_SET_KEY.alignment,
          value: chartDataConfig.options.subtitle.align,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: alignments,
          render: config.globalOptions.subtitle.includes('alignment'),
        },
        // {
        //   id: 'subtitle-color',
        //   label: 'Color',
        //   datasetKey: DATA_SET_KEY.color,
        //   value: chartDataConfig.options.subtitle.color,
        //   tooltip: 'Only Hex code supported. (#rrggbb)',
        //   onChange: onSubtitlePropsUpdate,
        //   type: INPUT_TYPE.COLOR,
        //   render: config.globalOptions.subtitle.includes(INPUT_TYPE.COLOR),
        // },
        {
          id: 'subtitle-font-size',
          label: 'Font Size',
          subLabel: 'px',
          datasetKey: DATA_SET_KEY.fontSize,
          value: chartDataConfig.options.subtitle.style.fontSize,
          tooltip: 'Max value allowed is 56px.',
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.NUMBER,
          render: config.globalOptions.subtitle.includes('font'),
        },
      ],
    };
  }, [chartDataConfig, config, onSubtitlePropsUpdate]);

  const onGridPropsUpdate = useCallback(
    (_event: any, key: DATA_SET_KEY) => {
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.render:
          config.options.grid.show = !config.options.grid.show;
          break;
        case DATA_SET_KEY.gridXAxis:
          config.options.grid.xaxis.lines.show =
            !config.options.grid.xaxis.lines.show;
          break;
        case DATA_SET_KEY.gridYAxis:
          config.options.grid.yaxis.lines.show =
            !config.options.grid.yaxis.lines.show;
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

  const gridOptions = useMemo(() => {
    if (!config || !config.globalOptions.grid || !chartDataConfig) {
      return {};
    }
    return {
      id: 'grid-options',
      panelHeading: 'Grid Lines',
      inputsProps: [
        {
          id: 'grid-enabled',
          label: 'Enabled',
          datasetKey: DATA_SET_KEY.render,
          value: chartDataConfig.options.grid.show,
          onChange: onGridPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.grid.includes(DATA_SET_KEY.render),
        },
        {
          id: 'grid-xaxis',
          label: 'Show X-axis',
          datasetKey: DATA_SET_KEY.gridXAxis,
          value: chartDataConfig.options.grid.xaxis.lines.show,
          onChange: onGridPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.grid.includes('xaxis'),
        },
        {
          id: 'grid-yaxis',
          label: 'Show Y-axis',
          datasetKey: DATA_SET_KEY.gridYAxis,
          value: chartDataConfig.options.grid.yaxis.lines.show,
          onChange: onGridPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          render: config.globalOptions.grid.includes('yaxis'),
        },
      ],
    };
  }, [chartDataConfig, config, onGridPropsUpdate]);

  const generateChartGlobalOptions = useCallback(() => {
    if (!config) {
      return;
    }
    const globalOpts: Array<IChartGlobalOptions> = [];
    Object.keys(config.globalOptions).forEach((opts) => {
      switch (opts) {
        case CHART_FEATURE.TITLE:
          globalOpts.push(titleOptions as IChartGlobalOptions);
          break;
        case CHART_FEATURE.SUBTITLE:
          globalOpts.push(subtitleOptions as IChartGlobalOptions);
          break;
        case CHART_FEATURE.LEGEND:
          globalOpts.push(legendOptions as IChartGlobalOptions);
          break;
        case CHART_FEATURE.GRID:
          globalOpts.push(gridOptions as IChartGlobalOptions);
          break;
        case CHART_FEATURE.DATA_LABELS:
          globalOpts.push(dataLabelOptions as IChartGlobalOptions);
          break;
        default:
          break;
      }
    });
    setGlobalOptions(globalOpts);
  }, [
    config,
    dataLabelOptions,
    gridOptions,
    legendOptions,
    subtitleOptions,
    titleOptions,
  ]);

  useEffect(() => {
    if (config) {
      generateChartGlobalOptions();
    }
  }, [config, generateChartGlobalOptions]);

  return (
    <div className="px-4">
      {globalOptions.map((options: IChartGlobalOptions) => {
        return (
          <div className="mt-2" key={options.id}>
            <CWAccordian
              id={options.id}
              panelHeading={options.panelHeading}
              defaultOpen={options.open}
              panelComponent={options.inputsProps.map(
                (props: IInputRenderer) => {
                  return (
                    <div className="mt-2" key={props.id}>
                      <InputRenderer {...props} />
                    </div>
                  );
                }
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

export default GlobalOptionsEditor;
