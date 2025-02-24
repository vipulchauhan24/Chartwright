import { useAtom } from 'jotai';
import AppShell from './layout/appshell';
import {
  fetchAllChartConfigById,
  fetchAllChartData,
} from '../../service/chartsApi';
import { allCharts, loadingChartConfig } from '../../store/charts';
import { useEffect } from 'react';
import ChartRenderer from './containers/chartRenderer';
import GlobalOptionsEditor from './containers/globalOptionsEditor';
import CWLink from '../components/link';
import Spinner from '../components/spinner';
import ChartDataEditor from './containers/chartDataEditor';

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
        <Spinner />
      </div>
    );
  }

  return (
    <AppShell>
      <div className="flex items-start justify-between h-full">
        <aside className="w-1/5 min-w-80 h-full border-r border-primary-border flex flex-col items-center">
          <div className="w-full h-full overflow-y-auto">
            <GlobalOptionsEditor />
          </div>
          <div className="p-4">
            <CWLink href="#" label="Need Help?" />
          </div>
        </aside>
        <ChartRenderer />
        <aside className="w-1/5 min-w-80 h-full border-l border-primary-border overflow-y-auto">
          <ChartDataEditor />
        </aside>
      </div>
    </AppShell>
  );
}

export default ChartEditor;
