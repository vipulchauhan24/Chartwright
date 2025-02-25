import { useAtom } from 'jotai';
import CWAccordian from '../../../components/accordian';
import {
  chartDataConfigStore,
  chartGlobalConfig,
} from '../../../../store/charts';
import ChartLabelEditor from '../chartLabelEditor';
import { DATA_SET_KEY, INPUT_TYPE } from '../../utils/enums';
import InputRenderer, { IInputRenderer } from '../inputRenderer';
import { useCallback, useMemo } from 'react';
import Tippy from '@tippyjs/react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface IChartDataOptions {
  id: string;
  panelHeading: string;
  open?: boolean;
  inputsProps: Array<IInputRenderer>;
}

function ChartDataEditor() {
  const [config] = useAtom(chartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(chartDataConfigStore);

  const deleteChartSeries = (index: number) => {
    const config = JSON.parse(JSON.stringify(chartDataConfig));
    config.options.series.splice(index, 1);
    setChartDataConfig(config);
  };

  const onChartDataOptionsUpdate = useCallback(
    (event: any, datasetKey: DATA_SET_KEY, indx: number) => {
      if (event) {
        event.stopPropagation();
      }
      const config = JSON.parse(JSON.stringify(chartDataConfig));
      let configChanged = true;

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
    const options: Array<IChartDataOptions> = [];
    chartDataConfig.options.series.forEach(
      (series: { name: string; data: Array<string> }, indx: number) => {
        const opts = {
          id: `chart-data-editor-acc-${indx}`,
          panelHeading: `Edit ${series.name}`,
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
              enabled: config.chartOptions.includes(DATA_SET_KEY.label),
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
              enabled: config.chartOptions.includes(DATA_SET_KEY.data),
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
              enabled: config.chartOptions.includes(DATA_SET_KEY.color),
              hint: 'Only 6-digit hex code supported',
            },
          ],
        };
        options.push(opts);
      }
    );
    return options;
  }, [chartDataConfig, config, onChartDataOptionsUpdate]);

  return (
    <div className="mt-2 px-4">
      <ChartLabelEditor />
      {chartDataOptions.map((options: IChartDataOptions, indx: number) => {
        return (
          <div className="mt-2" key={options.id}>
            <CWAccordian
              id={options.id}
              panelHeading={options.panelHeading}
              defaultOpen={options.open}
              panelHeadingButton={
                <Tippy content="Delete this series">
                  <span
                    role="button"
                    onClick={() => {
                      deleteChartSeries(indx);
                    }}
                    className="cursor-pointer bg-primary-background p-1 hover:bg-primary-main hover:text-primary-background rounded-sm"
                  >
                    <TrashIcon className="size-4" aria-hidden={true} />
                  </span>
                </Tippy>
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
    </div>
  );
}

export default ChartDataEditor;
