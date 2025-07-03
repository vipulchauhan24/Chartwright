import React from 'react';
import { getNestedValue, isArray } from '../../utils/lib';
import CWAccordian from '../../../components/accordian';
import InputRenderer from '../inputRenderer';

function ChartEditPanel(props: {
  options: any;
  chartDataConfig: any;
  updateChartDataConfig: (
    path: string,
    value: string | string[] | boolean | number | number[]
  ) => void;
  title?: string;
  id?: string;
  configPathPrefix?: string;
}) {
  const {
    options,
    chartDataConfig,
    title,
    id,
    updateChartDataConfig,
    configPathPrefix,
  } = props;

  if (isArray(options)) {
    return (
      <CWAccordian
        id={`${id}`}
        panelHeading={`${title}`}
        defaultOpen={false}
        panelComponent={options.map((inputProps: any, indx: number) => {
          if (inputProps['subGroup']) {
            const key = Object.keys(inputProps)[1];
            return (
              <div className="mt-2">
                <ChartEditPanel
                  options={inputProps[key]}
                  title={key}
                  id={`${key}-${indx}`}
                  chartDataConfig={chartDataConfig}
                  updateChartDataConfig={updateChartDataConfig}
                  configPathPrefix={configPathPrefix}
                />
              </div>
            );
          }
          const inputValue = () => {
            const value = getNestedValue(
              chartDataConfig.options,
              configPathPrefix
                ? configPathPrefix + inputProps['configPath']
                : inputProps['configPath']
            );
            if (typeof value === 'boolean') {
              return value;
            }
            return value || inputProps['default'];
          };

          return (
            <div className="mt-2">
              <InputRenderer
                {...inputProps}
                value={inputValue()}
                updateChartDataConfig={updateChartDataConfig}
                configPathPrefix={configPathPrefix}
              />
            </div>
          );
        })}
      />
    );
  }

  return null;
}

export default React.memo(ChartEditPanel);
