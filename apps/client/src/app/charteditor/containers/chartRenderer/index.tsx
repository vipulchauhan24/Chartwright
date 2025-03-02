import { useAtom } from 'jotai';
import { chartDataConfigStore } from '../../../../store/charts';
import ApexCharts from 'apexcharts';
import { useEffect, useRef } from 'react';

function ChartRenderer() {
  const [chartDataConfig] = useAtom(chartDataConfigStore);
  const chartRef = useRef<any>(null);
  const apexRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const destroy = () => {
    if (apexRef.current) {
      apexRef.current.destroy();
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (chartDataConfig && chartRef.current) {
      timeoutRef.current = setTimeout(() => {
        destroy();
        const chart = new ApexCharts(chartRef.current, chartDataConfig.options);
        chart.render();
        apexRef.current = chart;
      }, 250);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [chartDataConfig]);

  return (
    <div className="w-full h-[calc(100%_-_1.625rem)] overflow-y-auto">
      <div className="w-full p-3 flex items-center justify-center">
        <div ref={chartRef} className="w-11/12"></div>
      </div>
    </div>
  );
}

export default ChartRenderer;
