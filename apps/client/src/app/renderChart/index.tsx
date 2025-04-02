import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { fetchChartDataById } from '../../service/chartsApi';
import ChartRenderer from '../charteditor/containers/chartRenderer';

function RenderChart() {
  const [, fetchConfigData] = useAtom(fetchChartDataById);

  useEffect(() => {
    fetchConfigData('simpleBarChart');
  });

  return <ChartRenderer />;
}

export default RenderChart;
