import { useAtom } from 'jotai';
import CWAccordian from '../../../components/accordian';
import {
  currentChartConfigStore,
  currentChartGlobalConfig,
} from '../../../../store/charts';
import ChartLabelEditor from '../chartLabelEditor';
import { CHART_TYPE, DATA_SET_KEY } from '../../utils/enums';
import InputRenderer, { IInputRenderer } from '../inputRenderer';
import { useCallback, useMemo } from 'react';
import Tippy from '@tippyjs/react';
import { Plus, Trash2 } from 'lucide-react';
import {
  generateBarAndLineChartDataOptions,
  generateBubbleChartDataOptions,
  generatePieChartDataOptions,
} from '../../../../service/chartDataOptions';
import usePlotOptions from '../../hooks/usePlotOptions';
import CWButton from '../../../components/button';
import {
  generateSeriesForBubbleChart,
  generateSeriesForChart,
} from '../../utils/lib';

interface IChartDataOptions {
  id: string;
  panelHeading: string;
  open?: boolean;
  inputsProps: Array<IInputRenderer>;
}

function ChartDataEditor() {
  const [config] = useAtom(currentChartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(
    currentChartConfigStore
  );
  const [plotOptions] = usePlotOptions();

  const deleteChartSeries = (index: number) => {
    const config = JSON.parse(JSON.stringify(chartDataConfig));
    config.options.series.splice(index, 1);
    setChartDataConfig(config);
  };

  const generatePieChartDataSeries = (series: string) => {
    const data = series.split(','),
      res: number[] = [];
    data.forEach((d: string) => {
      if (d.length) {
        res.push(parseInt(d));
      }
    });

    return res;
  };

  const onChartDataOptionsUpdate = useCallback(
    (event: any, datasetKey: DATA_SET_KEY, indx: number) => {
      if (event) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;

      if (config.options.chart.type !== CHART_TYPE.PIE) {
        switch (datasetKey) {
          case DATA_SET_KEY.label:
            config.options.series[indx].name = event.target.value;
            break;
          case DATA_SET_KEY.data:
            config.options.series[indx].data = event.target.value.split(',');
            break;
          case DATA_SET_KEY.color:
            config.options.colors[indx] = event.target.value;
            break;
          default:
            configChanged = false;
            break;
        }
      } else {
        switch (datasetKey) {
          case DATA_SET_KEY.data:
            config.options.series = generatePieChartDataSeries(
              event.target.value
            );
            break;
          case DATA_SET_KEY.color:
            config.options.colors[indx] = event.target.value;
            break;
          default:
            configChanged = false;
            break;
        }
      }

      if (configChanged) {
        setChartDataConfig(config);
      }
    },
    [chartDataConfig, setChartDataConfig]
  );

  const onBubbleChartDataUpdate = useCallback(
    (data: any, datasetKey: DATA_SET_KEY, indx: number) => {
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;
      switch (datasetKey) {
        case DATA_SET_KEY.data:
          config.options.series[indx].data = data;
          break;
        case DATA_SET_KEY.color:
          config.options.colors[indx] = data.target.value;
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

  const chartDataOptions = useMemo(() => {
    if (!config && !chartDataConfig) {
      return [];
    }

    if (chartDataConfig.options.chart.type === CHART_TYPE.PIE) {
      return generatePieChartDataOptions(
        config,
        chartDataConfig,
        onChartDataOptionsUpdate
      );
    } else if (chartDataConfig.options.chart.type === CHART_TYPE.BUBBLE) {
      return generateBubbleChartDataOptions(
        config,
        chartDataConfig,
        onBubbleChartDataUpdate
      );
    }

    return generateBarAndLineChartDataOptions(
      config,
      chartDataConfig,
      onChartDataOptionsUpdate
    );
  }, [
    chartDataConfig,
    config,
    onBubbleChartDataUpdate,
    onChartDataOptionsUpdate,
  ]);

  const addSeries = () => {
    const config = JSON.parse(JSON.stringify(chartDataConfig));
    switch (config.options.chart.type) {
      case CHART_TYPE.AREA:
      case CHART_TYPE.BAR:
      case CHART_TYPE.LINE:
        config.options.series = [
          ...config.options.series,
          generateSeriesForChart(
            config.options.series[0].data.length,
            config.options.series.length
          ),
        ];
        config.options.colors = [
          ...config.options.colors,
          config.options.colors[0],
        ];
        break;
      case CHART_TYPE.BUBBLE:
        config.options.series = [
          ...config.options.series,
          generateSeriesForBubbleChart(
            config.options.series[0].data.length,
            config.options.series[0].data[0].length,
            config.options.series.length
          ),
        ];
        config.options.colors = [
          ...config.options.colors,
          config.options.colors[0],
        ];
        break;

      default:
        break;
    }

    setChartDataConfig(config);
  };

  return (
    <div className="p-4">
      {chartDataConfig?.options.labels && <ChartLabelEditor />}
      {plotOptions?.inputsProps?.length ? (
        <div className="mt-2">
          <CWAccordian
            id={String(plotOptions.id)}
            panelHeading={String(plotOptions.panelHeading)}
            defaultOpen={true}
            panelComponent={plotOptions?.inputsProps?.map(
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
      ) : null}
      {chartDataOptions.map((options: IChartDataOptions, indx: number) => {
        return (
          <div className="mt-2" key={options.id}>
            <CWAccordian
              id={options.id}
              panelHeading={options.panelHeading}
              defaultOpen={options.open}
              panelHeadingButton={
                chartDataConfig?.options.chart.type !== CHART_TYPE.PIE ? (
                  <Tippy content={`Delete ${options.panelHeading}`}>
                    <span
                      role="button"
                      onClick={() => {
                        deleteChartSeries(indx);
                      }}
                      className="cursor-pointer bg-background p-1 hover:bg-primary hover:text-background rounded-sm"
                    >
                      <Trash2 className="size-4" aria-hidden={true} />
                    </span>
                  </Tippy>
                ) : null
              }
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
      {chartDataConfig?.options.chart.type !== CHART_TYPE.PIE && (
        <CWButton
          additionalCssClasses="mt-2"
          primary
          label={
            <p className="flex items-center gap-2">
              <Plus className="size-4" aria-hidden={true} />
              Add Series
            </p>
          }
          onClick={addSeries}
        />
      )}
    </div>
  );
}

export default ChartDataEditor;
