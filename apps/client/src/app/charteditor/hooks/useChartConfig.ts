import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { activeChartConfig, allChartBaseConfig } from '../../../store/charts';
import toast from 'react-hot-toast';
import { CHART_TYPES, randomHexColor } from '../utils/lib';

function useChartConfig() {
  const [, setChartDataConfig] = useAtom(activeChartConfig);
  const [allChartBaseConfigData] = useAtom(allChartBaseConfig);

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
    (series: any, type: CHART_TYPES) => {
      const color = randomHexColor();
      switch (type) {
        case CHART_TYPES.LINE:
        case CHART_TYPES.AREA:
          if (!series.itemStyle) {
            series.itemStyle = {};
          }
          series.itemStyle = {
            ...series.itemStyle,
            color: color,
            borderColor: color,
          };
          if (!series.lineStyle) {
            series.lineStyle = {};
          }
          series.lineStyle = {
            ...series.lineStyle,
            color: color,
          };
          if (!series.areaStyle) {
            series.lineStyle = {};
          }
          series.areaStyle = {
            ...series.areaStyle,
            color: color,
            borderColor: color,
          };
          break;
        case CHART_TYPES.BAR:
        case CHART_TYPES.COLUMN:
          if (!series.itemStyle) {
            series.itemStyle = {};
          }
          series.itemStyle = {
            ...series.itemStyle,
            color: color,
            borderColor: color,
          };
          break;

        default:
          break;
      }
    },
    []
  );

  const buildChartConfig = useCallback(
    async (data: Array<never>, xColumnName: string, type: CHART_TYPES) => {
      try {
        setIsProcessing(true);

        const chartConfig = allChartBaseConfigData.find(
          (config: { type: string }) => config.type === type
        ).config;

        if (!chartConfig) {
          throw new Error('Chart default config not found!');
        }

        if (type === CHART_TYPES.BAR) {
          chartConfig.yAxis.data = getXAxisArray(xColumnName, data);
        } else {
          chartConfig.xAxis.data = getXAxisArray(xColumnName, data);
        }

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
      allChartBaseConfigData,
      getSeriesData,
      getXAxisArray,
      setChartDataConfig,
      setRandomColorToSeries,
    ]
  );

  return { isProcessing, buildChartConfig };
}

export default useChartConfig;
