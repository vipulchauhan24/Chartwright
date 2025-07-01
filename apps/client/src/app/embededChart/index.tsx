import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEmbedChartConfig } from '../../service/chartsApi';
import { currentChartConfigStore } from '../../store/charts';
import ApexCharts from 'apexcharts';

function EmbededChart() {
  const { id } = useParams();
  const [chartDataConfig] = useAtom(currentChartConfigStore);
  const [, getEmbedChartConfig] = useAtom(fetchEmbedChartConfig);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (id) {
      getEmbedChartConfig(id);
    }
  }, [getEmbedChartConfig, id]);

  useEffect(() => {
    if (!chartDataConfig || !chartDataConfig.options) {
      return;
    }
    const chart = new ApexCharts(chartRef.current, chartDataConfig.options);
    chart.render();
  }, [chartDataConfig]);

  return <div ref={chartRef}></div>;
}

export default EmbededChart;
