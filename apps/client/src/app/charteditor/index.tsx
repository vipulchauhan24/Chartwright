import { useAtom } from 'jotai';
import AppShell from './layout/appshell';
import {
  fetchAllChartConfigById,
  fetchAllChartData,
} from '../../service/chartsApi';
import { allCharts, loadingChartConfig } from '../../store/charts';
import { useEffect } from 'react';

function ChartEditor() {
  const [, fetchData] = useAtom(fetchAllChartData);
  const [, fetchConfigData] = useAtom(fetchAllChartConfigById);
  const [data] = useAtom(allCharts);
  const [isLoading] = useAtom(loadingChartConfig);

  useEffect(() => {
    fetchData(); // Fetch data on mount
  }, [fetchData]);

  useEffect(() => {
    if (data.length) {
      fetchConfigData((data[0] as any).chart_id['S']);
    }
  }, [data, fetchConfigData]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <AppShell>
      <p>hello</p>
    </AppShell>
  );
}

export default ChartEditor;
