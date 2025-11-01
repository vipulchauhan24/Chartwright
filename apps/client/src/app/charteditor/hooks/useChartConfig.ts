import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { currentChartConfigStore } from '../../../store/charts';
import { getChartBaseConfig } from '../../../service/chartsApi';
import toast from 'react-hot-toast';
import { randomHexColor } from '../utils/lib';

type chart_types = 'bar' | 'line';

function useChartConfig() {
  const [, setChartDataConfig] = useAtom(currentChartConfigStore);
  const [, getChartDefaultConfig] = useAtom(getChartBaseConfig);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

  const setRandomColorToSeries = useCallback(
    (series: any, type: chart_types) => {
      const color = randomHexColor();
      switch (type) {
        case 'line':
          series['lineStyle']['color'] = color;
          series['itemStyle']['color'] = color;
          series['itemStyle']['borderColor'] = color;
          break;
        case 'bar':
          series['itemStyle']['color'] = color;
          series['itemStyle']['borderColor'] = color;
          break;

        default:
          break;
      }
    },
    []
  );

  const buildChartConfig = useCallback(
    async (data: Array<never>, xColumnName: string, type: chart_types) => {
      try {
        setIsProcessing(true);
        const chartConfig = await getChartDefaultConfig(type);

        if (!chartConfig) {
          throw new Error('Chart default config not found!');
        }
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
            setRandomColorToSeries(chartConfig.series[seriesIndx], type);
            seriesIndx++;
          }
        });
        setChartDataConfig(JSON.parse(JSON.stringify(chartConfig)));
        return chartConfig;
      } catch (error) {
        console.error("Error in 'building chart config': ", error);
        toast.error('Oops! Something went wrong. Please try again later.');
      } finally {
        setIsProcessing(false);
      }
    },
    [
      getChartDefaultConfig,
      getSeriesData,
      getXAxisArray,
      setChartDataConfig,
      setRandomColorToSeries,
    ]
  );

  return { isProcessing, buildChartConfig };
}

export default useChartConfig;
