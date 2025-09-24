import { CWSolidIconButton, CWSpinner } from '@chartwright/ui-components';
import { useAtom } from 'jotai';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadingMyCharts, myCharts } from '../../../../store/charts';
import { fetchMyCharts } from '../../../../service/chartsApi';
import { fetchFromLocalStorage } from '../../utils/lib';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { ExternalLink } from 'lucide-react';
interface IViewMyCharts {
  toggleMyChartsModal: (open: boolean) => void;
}
function ViewMyCharts(props: IViewMyCharts) {
  const { toggleMyChartsModal } = props;
  const navigate = useNavigate();
  const [isLoading] = useAtom(loadingMyCharts);
  const [, fetchCharts] = useAtom(fetchMyCharts);
  const [charts] = useAtom(myCharts);

  useEffect(() => {
    const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
    if (userId) {
      fetchCharts(userId);
    }
  }, [fetchCharts]);

  const viewMyChart = useCallback(
    (chartId: string) => {
      toggleMyChartsModal(false);
      navigate(`/chart/${chartId}`);
    },
    [navigate, toggleMyChartsModal]
  );

  return (
    <div>
      {isLoading ? (
        <div className="py-10 px-40 flex items-center justify-center">
          <CWSpinner />
        </div>
      ) : charts.length ? (
        <div className=" mt-4 relative overflow-x-auto">
          <table className="w-full text-sm text-left text-body">
            <thead className="text-xs uppercase bg-app">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Chart Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Chart Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Created Date
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {charts.map((chart, indx) => {
                return (
                  <tr
                    key={`${chart['title']}-${indx}`}
                    className="bg-surface border-b border-default"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-surface"
                    >
                      {chart['title']}
                    </th>
                    <td className="px-6 py-4">{chart['chart_type']}</td>
                    <td className="px-6 py-4">{chart['created_date']}</td>
                    <td className="px-6 py-4">
                      <CWSolidIconButton
                        onClick={() => {
                          viewMyChart(chart['id']);
                        }}
                        label="View"
                        icon={
                          <ExternalLink className="size-4" aria-hidden={true} />
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <h2>No Save Charts</h2>
      )}
    </div>
  );
}

export default React.memo(ViewMyCharts);
