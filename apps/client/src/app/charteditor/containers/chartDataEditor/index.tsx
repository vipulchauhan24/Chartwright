import { useAtom } from 'jotai';
import {
  currentChartConfigStore,
  currentChartGlobalConfig,
} from '../../../../store/charts';
import clsx from 'clsx';
import { setByPath } from '../../utils/lib';
import ChartEditPanel from '../chartEditPanel';

function ChartDataEditor() {
  const [chartEditableFeatures] = useAtom(currentChartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(
    currentChartConfigStore
  );

  const updateChartDataConfig = (
    path: string,
    value: string | string[] | boolean | number | number[]
  ) => {
    const config = JSON.parse(JSON.stringify(chartDataConfig));
    setByPath(config.options, path, value);
    setChartDataConfig(config);
  };

  if (
    !chartDataConfig?.options?.series ||
    !chartEditableFeatures?.chartEditOptions ||
    !chartEditableFeatures?.chartEditSeries
  ) {
    return null;
  }

  return (
    <div className="p-4">
      {Object.keys(chartEditableFeatures.chartEditOptions).map(
        (key: string, indx: number) => {
          return (
            <div className={clsx(indx && 'mt-2')} key={key}>
              <ChartEditPanel
                options={chartEditableFeatures.chartEditOptions[key]}
                title={key}
                id={`${key}-${indx}`}
                chartDataConfig={chartDataConfig}
                updateChartDataConfig={updateChartDataConfig}
              />
            </div>
          );
        }
      )}
      <div className="mt-2">
        {chartDataConfig.options.series.map((_items: any, index: number) => {
          return Object.keys(chartEditableFeatures.chartEditSeries).map(
            (key: string, indx: number) => {
              return (
                <div className={clsx(indx && 'mt-2')} key={key}>
                  <ChartEditPanel
                    options={chartEditableFeatures.chartEditSeries[key]}
                    title={key}
                    id={`${key}-${indx}`}
                    chartDataConfig={chartDataConfig}
                    updateChartDataConfig={updateChartDataConfig}
                    configPathPrefix={`series.${index}.`}
                  />
                </div>
              );
            }
          );
        })}
      </div>
    </div>
  );
}

export default ChartDataEditor;
