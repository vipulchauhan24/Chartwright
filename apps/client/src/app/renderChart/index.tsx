import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { fetchChartConfig } from '../../service/chartsApi';
import ChartRenderer from '../charteditor/containers/chartRenderer';
import { useParams } from 'react-router-dom';

function RenderChart() {
  const { id } = useParams();
  const [, fetchDefaultChartConfig] = useAtom(fetchChartConfig);

  useEffect(() => {
    if (id) {
      fetchDefaultChartConfig(id);
    }
  }, [fetchDefaultChartConfig, id]);

  return <ChartRenderer />;
}

export default RenderChart;
