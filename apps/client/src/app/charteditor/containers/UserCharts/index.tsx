import {
  CWIconButton,
  CWSolidIconButton,
  CWSpinner,
  CWFullscreenLoading,
} from '@chartwright/ui-components';
import { useAtom } from 'jotai';
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadingMyCharts, userCharts } from '../../../../store/charts';
import {
  capitalizeFirstLetter,
  fetchFromLocalStorage,
  generateLocaleDateString,
} from '../../utils/lib';
import { ExternalLink, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { fetchAllUserCharts } from '../../../../service/chartsApi';
interface IViewMyCharts {
  toggleUserChartsView: (open: boolean) => void;
}
function ViewMyCharts(props: IViewMyCharts) {
  const { toggleUserChartsView } = props;
  const navigate = useNavigate();
  const params = useParams();

  const [isLoading] = useAtom(loadingMyCharts);
  const [charts] = useAtom(userCharts);
  const [, fetchUserCharts] = useAtom(fetchAllUserCharts);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadUserChart = useCallback(
    (chartId: string) => {
      toggleUserChartsView(false);
      navigate(`/chart/${chartId}`);
    },
    [navigate, toggleUserChartsView]
  );

  const deleteUserChart = useCallback(
    async (chartId: string) => {
      try {
        setIsDeleting(true);
        if (params?.id === chartId) {
          toast.error('Chart in edit mode cannot be deleted.');
          return;
        }
        await axios.delete(`${API_ENDPOINTS.USER_CHARTS}/${chartId}`);
        const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
        if (userId) {
          fetchUserCharts(userId);
        }
      } catch (error) {
        console.log('Error deleting user chart: ', error);
        toast.error('Chart cannot be deleted.');
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchUserCharts, params?.id]
  );

  return (
    <div>
      {isDeleting && <CWFullscreenLoading />}
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
                  Created On
                </th>
                <th scope="col" className="px-6 py-3">
                  Updated On
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
                    <td className="px-6 py-4">{chart['title']}</td>
                    <td className="px-6 py-4">
                      {capitalizeFirstLetter(chart['chart_type'])}
                    </td>
                    <td className="px-6 py-4">
                      {generateLocaleDateString(chart['created_date'])}
                    </td>
                    <td className="px-6 py-4">
                      {chart['updated_date']
                        ? generateLocaleDateString(chart['updated_date'])
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-start gap-2">
                        <CWSolidIconButton
                          onClick={() => {
                            loadUserChart(chart['id']);
                          }}
                          label="View"
                          iconRight={
                            <ExternalLink
                              className="size-4"
                              aria-hidden={true}
                            />
                          }
                        />
                        <CWIconButton
                          onClick={() => {
                            deleteUserChart(chart['id']);
                          }}
                          icon={<Trash className="size-4" aria-hidden={true} />}
                        />
                      </div>
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
