import { useAtom } from 'jotai';
import {
  currentChartConfigStore,
  currentChartGlobalConfig,
} from '../../../../store/charts';
import clsx from 'clsx';
import ChartEditPanel from '../chartEditPanel';
import { setByPath } from '../../utils/lib';

function GlobalOptionsEditor() {
  const [chartEditableFeatures] = useAtom(currentChartGlobalConfig);
  const [chartDataConfig, setChartDataConfig] = useAtom(
    currentChartConfigStore
  );

  const updateChartDataConfig = (
    path: string,
    value: string | string[] | boolean | number | number[]
  ) => {
    const config = JSON.parse(JSON.stringify(chartDataConfig));
    setByPath(config, path, value);
    setChartDataConfig(config);
  };

  if (!chartDataConfig || !chartEditableFeatures?.globalOptions) {
    return null;
  }

  return (
    <div className="p-4">
      {Object.keys(chartEditableFeatures.globalOptions).map(
        (key: string, indx: number) => {
          return (
            <div className={clsx(indx && 'mt-2')} key={key}>
              <ChartEditPanel
                options={chartEditableFeatures.globalOptions[key]}
                title={key}
                id={`${key}-${indx}`}
                chartDataConfig={chartDataConfig}
                updateChartDataConfig={updateChartDataConfig}
              />
            </div>
          );
        }
      )}
    </div>
  );
}

export default GlobalOptionsEditor;
