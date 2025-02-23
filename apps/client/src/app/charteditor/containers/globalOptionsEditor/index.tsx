import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  chartDataConfigStore,
  chartGlobalConfig,
} from '../../../../store/charts';
import { DATA_SET_KEY, INPUT_TYPE } from '../../utils/enums';
import { alignments, legendPositions } from '../../utils/constants';
import CWAccordian from '../../../components/accordian';
import InputRenderer, { IInputRenderer } from '../inputRenderer';

interface IChartGlobalOptions {
  id: string;
  panelHeading: string;
  open?: boolean;
  inputsProps: Array<IInputRenderer>;
}

function GlobalOptionsEditor() {
  const [config] = useAtom(chartGlobalConfig);
  const [chartDataConfig] = useAtom(chartDataConfigStore);
  const [globalOptions, setGlobalOptions] = useState<
    Array<IChartGlobalOptions>
  >([]);

  const onLegendPropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY) => {
      if (event) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.display:
          config.legend.show = !config.legend.show;
          break;
        case DATA_SET_KEY.position:
          config.legend.position = event.target.value;
          break;
        case DATA_SET_KEY.alignment:
          config.legend.horizontalAlign = event.target.value;
          break;
        // case DATA_SET_KEY.color:
        //   config.options.plugins.legend.labels.color = event.target.value;
        //   break;
        case DATA_SET_KEY.fontSize:
          config.options.legend.fontSize = event.target.value;
          break;
        default:
          configChanged = false;
          break;
      }

      //   if (configChanged) {
      //     setChartConfigurations(config);
      //   }
    },
    [chartDataConfig]
  );

  const legendOptions = useMemo(() => {
    if (!config || !chartDataConfig) {
      return {};
    }

    return {
      id: 'legend-options',
      panelHeading: 'Legend',
      open: true,
      inputsProps: [
        {
          id: 'legend-visible',
          label: 'Visible',
          value: chartDataConfig.options.legend.show,
          datasetKey: DATA_SET_KEY.display,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          enabled: config.globalOptions.legend.includes('visible'),
        },
        {
          id: 'legend-position',
          label: 'Position',
          datasetKey: DATA_SET_KEY.position,
          value: chartDataConfig.options.legend.position,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: legendPositions,
          enabled: config.globalOptions.legend.includes('position'),
        },
        {
          id: 'legend-alignment',
          label: 'Alignment',
          datasetKey: DATA_SET_KEY.alignment,
          value: chartDataConfig.options.legend.horizontalAlign,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: alignments,
          enabled: config.globalOptions.legend.includes('alignment'),
        },
        // {
        //   id: 'legend-color',
        //   label: 'Color',
        //   datasetKey: DATA_SET_KEY.color,
        //   value: chartConfigurations.options.plugins.legend.labels.color,
        //   tooltip: 'Only Hex code supported. (#rrggbb)',
        //   onChange: onLegendPropsUpdate,
        //   type: INPUT_TYPE.COLOR,
        //   enabled: chartGlobalConfigurations.globalOptions.legend.includes(
        //     INPUT_TYPE.COLOR
        //   ),
        // },
        {
          id: 'legend-label-font-size',
          label: 'Font Size',
          datasetKey: DATA_SET_KEY.fontSize,
          value: chartDataConfig.options.legend.fontSize,
          onChange: onLegendPropsUpdate,
          type: INPUT_TYPE.NUMBER,
          enabled: config.globalOptions.legend.includes('font'),
        },
      ],
    };
  }, [chartDataConfig, config, onLegendPropsUpdate]);

  const onTitlePropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY) => {
      if (event) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.display:
          config.options.title.show = !config.options.title.show;
          break;
        case DATA_SET_KEY.position:
          config.options.title.position = event.target.value;
          break;
        case DATA_SET_KEY.alignment:
          config.options.title.align = event.target.value;
          break;
        // case DATA_SET_KEY.color:
        //   config.options.plugins.title.color = event.target.value;
        //   break;
        case DATA_SET_KEY.fontSize:
          config.options.title.style.fontSize = event.target.value;
          break;
        case DATA_SET_KEY.data:
          config.options.title.text = event.target.value;
          break;
        default:
          configChanged = false;
          break;
      }

      // if (configChanged) {
      //   setChartConfigurations(config);
      // }
    },
    [chartDataConfig]
  );

  const titleOptions = useMemo(() => {
    if (!config || !chartDataConfig) {
      return {};
    }
    return {
      id: 'title-options',
      panelHeading: 'Title',
      inputsProps: [
        {
          id: 'title-visible',
          label: 'Visible',
          datasetKey: DATA_SET_KEY.display,
          value: chartDataConfig.options.title.show,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          enabled: config.globalOptions.title.includes('visible'),
        },
        {
          id: 'title-text',
          label: 'Text',
          datasetKey: DATA_SET_KEY.data,
          value: chartDataConfig.options.title.text,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.TEXT,
          enabled: config.globalOptions.title.includes(INPUT_TYPE.TEXT),
        },
        {
          id: 'title-alignment',
          label: 'Alignment',
          datasetKey: DATA_SET_KEY.alignment,
          value: chartDataConfig.options.title.align,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: alignments,
          enabled: config.globalOptions.title.includes('alignment'),
        },
        // {
        //   id: 'title-color',
        //   label: 'Color',
        //   datasetKey: DATA_SET_KEY.color,
        //   value: chartConfigurations.options.plugins.title.color,
        //   tooltip: 'Only Hex code supported. (#rrggbb)',
        //   onChange: onTitlePropsUpdate,
        //   type: INPUT_TYPE.COLOR,
        //   enabled: chartGlobalConfigurations.globalOptions.title.includes(
        //     INPUT_TYPE.COLOR
        //   ),
        // },
        {
          id: 'title-font-size',
          label: 'Font Size',
          datasetKey: DATA_SET_KEY.fontSize,
          value: chartDataConfig.options.title.style.fontSize,
          onChange: onTitlePropsUpdate,
          type: INPUT_TYPE.NUMBER,
          enabled: config.globalOptions.title.includes('font'),
        },
      ],
    };
  }, [chartDataConfig, config, onTitlePropsUpdate]);

  const onSubtitlePropsUpdate = useCallback(
    (event: any, key: DATA_SET_KEY) => {
      if (event) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (key) {
        case DATA_SET_KEY.display:
          config.options.subtitle.show = !config.options.subtitle.show;
          break;
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

      // if (configChanged) {
      //   setChartConfigurations(config);
      // }
    },
    [chartDataConfig]
  );

  const subtitleOptions = useMemo(() => {
    if (!config || !chartDataConfig) {
      return {};
    }
    return {
      id: 'subtitle-options',
      panelHeading: 'Subtitle',
      inputsProps: [
        {
          id: 'subtitle-visible',
          label: 'Visible',
          datasetKey: DATA_SET_KEY.display,
          value: chartDataConfig.options.subtitle.show,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          enabled: config.globalOptions.subtitle.includes('visible'),
        },
        {
          id: 'subtitle-text',
          label: 'Text',
          datasetKey: DATA_SET_KEY.data,
          value: chartDataConfig.options.subtitle.text,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.TEXT,
          enabled: config.globalOptions.subtitle.includes(INPUT_TYPE.TEXT),
        },
        {
          id: 'subtitle-alignment',
          label: 'Alignment',
          datasetKey: DATA_SET_KEY.alignment,
          value: chartDataConfig.options.subtitle.align,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.SELECT,
          options: alignments,
          enabled: config.globalOptions.subtitle.includes('alignment'),
        },
        // {
        //   id: 'subtitle-color',
        //   label: 'Color',
        //   datasetKey: DATA_SET_KEY.color,
        //   value: chartDataConfig.options.subtitle.color,
        //   tooltip: 'Only Hex code supported. (#rrggbb)',
        //   onChange: onSubtitlePropsUpdate,
        //   type: INPUT_TYPE.COLOR,
        //   enabled: config.globalOptions.subtitle.includes(INPUT_TYPE.COLOR),
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
          enabled: config.globalOptions.subtitle.includes('font'),
        },
      ],
    };
  }, [chartDataConfig, config, onSubtitlePropsUpdate]);

  const gridOptions = useMemo(() => {
    if (!config || !chartDataConfig) {
      return {};
    }
    return {
      id: 'grid-options',
      panelHeading: 'Grid Lines',
      inputsProps: [
        {
          id: 'grid-visible',
          label: 'Visible',
          datasetKey: DATA_SET_KEY.display,
          value: chartDataConfig.options.grid,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          enabled: config.globalOptions.grid.includes('visible'),
        },
        {
          id: 'grid-xaxis',
          label: 'Show X-axis',
          datasetKey: DATA_SET_KEY.gridXAxis,
          value: chartDataConfig.options.grid.xaxis.lines.show,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          enabled: config.globalOptions.grid.includes('xaxis'),
        },
        {
          id: 'grid-yaxis',
          label: 'Show Y-axis',
          datasetKey: DATA_SET_KEY.gridYAxis,
          value: chartDataConfig.options.grid.yaxis.lines.show,
          onChange: onSubtitlePropsUpdate,
          type: INPUT_TYPE.CHECKBOX,
          enabled: config.globalOptions.grid.includes('yaxis'),
        },
      ],
    };
  }, [chartDataConfig, config, onSubtitlePropsUpdate]);

  const generateChartGlobalOptions = useCallback(() => {
    if (!config) {
      return;
    }
    const globalOpts: Array<IChartGlobalOptions> = [];
    Object.keys(config.globalOptions).forEach((opts) => {
      switch (opts) {
        case 'legend':
          globalOpts.push(legendOptions as IChartGlobalOptions);
          break;
        case 'title':
          globalOpts.push(titleOptions as IChartGlobalOptions);
          break;
        case 'subtitle':
          globalOpts.push(subtitleOptions as IChartGlobalOptions);
          break;
        case 'grid':
          globalOpts.push(gridOptions as IChartGlobalOptions);
          break;
        // case 'yAxis':
        //   globalOpts.push(yAxisOptions as IChartGlobalOptions);
        //   break;
        // case 'others':
        //   globalOpts.push({
        //     id: 'others-options',
        //     sectionTitle: 'Other options',
        //     inputsProps: [
        //       {
        //         id: 'canvas-background',
        //         label: 'Chart Background',
        //         type: INPUT_TYPE.COLOR,
        //         tooltip: 'Only Hex code supported. (#rrggbb)',
        //         value:
        //           chartConfigurations.options.plugins
        //             .customCanvasBackgroundColor.color,
        //         onChange: onChartBackgroundUpdate,
        //         enabled:
        //           chartGlobalConfigurations.globalOptions.others.includes(
        //             'background'
        //           ),
        //       },
        //     ],
        //   });
        //   break;
        default:
          break;
      }
    });
    setGlobalOptions(globalOpts);
  }, [config, gridOptions, legendOptions, subtitleOptions, titleOptions]);

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
