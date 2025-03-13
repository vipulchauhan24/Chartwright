import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { fetchAllChartConfigById } from '../../service/chartsApi';
import ChartRenderer from '../charteditor/containers/chartRenderer';

function RenderChart() {
  const [, fetchConfigData] = useAtom(fetchAllChartConfigById);

  useEffect(() => {
    fetchConfigData('simpleBarChart');
  });

  return <ChartRenderer />;
}

export default RenderChart;
