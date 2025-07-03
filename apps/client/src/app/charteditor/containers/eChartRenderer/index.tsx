import React, { useCallback, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useAtom } from 'jotai';
import { currentChartConfigStore } from '../../../../store/charts';
import { isExportDisabled } from '../../../../store/app';

function EChartRenderer() {
  const [chartDataConfig] = useAtom(currentChartConfigStore);
  const chartRef = useRef(null);
  const chartInstance = useRef<echarts.EChartsType | undefined>(undefined);
  const [, setIsExportChartDisabled] = useAtom(isExportDisabled);

  const chartRenderFinished = useCallback(() => {
    setIsExportChartDisabled(false);
  }, [setIsExportChartDisabled]);

  useEffect(() => {
    chartInstance.current = echarts.init(chartRef.current);

    // Clean up on unmount
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartDataConfig) {
      return;
    }
    chartInstance.current?.on('finished', function () {
      chartRenderFinished();
    });
    chartInstance.current?.setOption({ ...chartDataConfig });
  }, [chartDataConfig, chartRenderFinished]);

  return (
    <div className="w-full h-[calc(100%_-_58px)] p-3 relative">
      {/* {!isChartRendered && (
        <div className="h-full w-full flex items-center justify-center animate-pulse bg-background rounded-xl">
          <ChartNoAxesCombined
            className="size-10 stroke-border"
            aria-hidden={true}
          />
        </div>
      )} */}
      <div ref={chartRef} className="h-full"></div>
    </div>
  );
}

export default React.memo(EChartRenderer);
