import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { setDefaultChartConfig } from '../../service/chartsApi';
import ChartRenderer from '../charteditor/containers/chartRenderer';

function RenderChart() {
  const [, getDefaultChartConfig] = useAtom(setDefaultChartConfig);

  useEffect(() => {
    getDefaultChartConfig('simple-bar-chart');
  });

  return <ChartRenderer />;
}

export default RenderChart;
