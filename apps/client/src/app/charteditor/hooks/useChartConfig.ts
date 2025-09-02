import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { currentChartConfigStore } from '../../../store/charts';

function useChartConfig() {
  const [, setChartDataConfig] = useAtom(currentChartConfigStore);
  const getXAxisArray = useCallback(
    (xColumnName: string, data: Array<never>) => {
      return data.map((row) => row[xColumnName]);
    },
    []
  );

  const getSeriesData = useCallback(
    (sColumnName: string, data: Array<never>) => {
      return data.map((row) => row[sColumnName]);
    },
    []
  );

  const buildChartConfig = useCallback(
    async (data: Array<never>, xColumnName: string, type: 'bar' | 'line') => {
      let defConfig = null;
      switch (type) {
        case 'bar': {
          defConfig = await import(
            '../../../store/jsons/charts/bar-chart.json'
          );
          break;
        }

        case 'line': {
          defConfig = await import(
            '../../../store/jsons/charts/line-chart.json'
          );
          break;
        }

        default:
          return null;
      }

      if (!defConfig.default) return null;

      const chartConfig = defConfig.default;
      chartConfig.xAxis.data = getXAxisArray(xColumnName, data);
      let seriesIndx = 0;
      Object.keys(data[0]).forEach((colName) => {
        if (colName === xColumnName || colName === '__rowNum__') return;

        let areNumbers = true;
        const srs: any[] = [];

        data.forEach((row: any) => {
          if (row[colName] && typeof row[colName] !== 'number') {
            areNumbers = false;
          } else if (!row[colName] && areNumbers) {
            row[colName] = 0;
          }
          srs.push(row[colName]);
        });

        if (areNumbers) {
          if (!chartConfig.series[seriesIndx]) {
            chartConfig.series[seriesIndx] = JSON.parse(
              JSON.stringify(chartConfig.series[seriesIndx - 1])
            );
          }
          chartConfig.series[seriesIndx].data = getSeriesData(colName, data);
          chartConfig.series[seriesIndx].name =
            colName !== '__EMPTY' ? colName : `Series ${seriesIndx + 1}`;
          seriesIndx++;
        }
      });
      setChartDataConfig(JSON.parse(JSON.stringify(chartConfig)));
      return chartConfig;
    },
    [getSeriesData, getXAxisArray, setChartDataConfig]
  );

  return { buildChartConfig };
}

export default useChartConfig;
