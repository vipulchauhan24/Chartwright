import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useAtom } from 'jotai';
import { currentChartConfigStore } from '../../../../store/charts';

function EChartRenderer() {
  const [chartDataConfig] = useAtom(currentChartConfigStore);

  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartDataConfig?.options) {
      return;
    }
    const chart = echarts.init(chartRef.current);

    chart.setOption({ ...chartDataConfig.options });

    // Clean up on unmount
    return () => {
      chart.dispose();
    };
  }, [chartDataConfig]);

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
