import {
  CWIconButton,
  CWSolidIconButton,
  CWSpinner,
  CWFullscreenLoading,
  CWModal,
  CWOutlineButton,
  CWSolidLoadingButton,
} from '@chartwright/ui-components';
import { useAtom } from 'jotai';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  allEmbedChartDetails,
  loadingUserCharts,
  userCharts,
} from '../../../../store/charts';
import {
  capitalizeFirstLetter,
  EMBEDDABLES,
  generateLocaleDateString,
} from '../../utils/lib';
import { ExternalLink, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../utils/constants';
import { fetchAllUserCharts } from '../../../../service/chartsApi';
import { api } from '../../../api-client';
import { useAuth } from 'react-oidc-context';
interface IUserCharts {
  toggleUserChartsView: (open: boolean) => void;
}

function UserCharts(props: IUserCharts) {
  const { toggleUserChartsView } = props;
  const navigate = useNavigate();
  const { chart_id } = useParams();
  const { isAuthenticated } = useAuth();

  const [isLoading] = useAtom(loadingUserCharts);
  const [charts] = useAtom(userCharts);
  const [, fetchUserCharts] = useAtom(fetchAllUserCharts);
  const [allEmbedChartData, setAllEmbedChartData] =
    useAtom(allEmbedChartDetails);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isChartEmbedded, setIsChartEmbedded] = useState<boolean>(false);

  const deleteReqChartId = useRef<string>('');

  const loadUserChart = useCallback(
    (chartId: string) => {
      toggleUserChartsView(false);
      navigate(`/chart/${chartId}`);
    },
    [navigate, toggleUserChartsView]
  );

  const deleteUserChart = useCallback(
    async (chartId: string, ingoreEmbedChart = false) => {
      try {
        if (!chartId.length) {
          toast.error('Oops! something went wrong.');
          return;
        }
        setIsDeleting(true);
        const chartEmbedded = allEmbedChartData[chartId];

        if (
          chartEmbedded &&
          (chartEmbedded[EMBEDDABLES.DYNAMIC_IFRAME]?.length ||
            chartEmbedded[EMBEDDABLES.STATIC_IMAGE]?.length) &&
          !ingoreEmbedChart
        ) {
          setIsChartEmbedded(true);
          deleteReqChartId.current = chartId;
          return;
        }
        if (chart_id === chartId) {
          toast.error('Chart in edit mode cannot be deleted.');
          return;
        }
        await api.instance.delete(`${API_ENDPOINTS.USER_CHARTS}/${chartId}`);
        if (isAuthenticated) {
          fetchUserCharts();
        }
        setAllEmbedChartData((prev: any) => {
          return {
            ...prev,
            [`${chartId}`]: {
              [`${EMBEDDABLES.DYNAMIC_IFRAME}`]: '',
              [`${EMBEDDABLES.STATIC_IMAGE}`]: '',
            },
          };
        });
        setIsChartEmbedded(false);
      } catch (error) {
        console.log('Error deleting user chart: ', error);
        toast.error('Chart cannot be deleted.');
      } finally {
        setIsDeleting(false);
      }
    },
    [
      allEmbedChartData,
      chart_id,
      fetchUserCharts,
      isAuthenticated,
      setAllEmbedChartData,
    ]
  );

  return (
    <div className="h-full">
      {isDeleting && <CWFullscreenLoading />}
      {isLoading ? (
        <div className="py-10 px-40 flex items-center justify-center">
          <CWSpinner />
        </div>
      ) : charts.length ? (
        <div className="h-full mt-4 relative overflow-y-auto">
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
                      {capitalizeFirstLetter(chart['chartType'])}
                    </td>
                    <td className="px-6 py-4">
                      {generateLocaleDateString(chart['createdDate'])}
                    </td>
                    <td className="px-6 py-4">
                      {chart['updatedDate']
                        ? generateLocaleDateString(chart['updatedDate'])
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
        <h3 className="mt-8 text-center text-xl font-bold text-body">
          No Saved Charts
        </h3>
      )}
      <CWModal
        {...{
          open: isChartEmbedded,
          setOpen: (open: boolean) => {
            setIsChartEmbedded(open);
          },
          title: 'Confirm deletion',
          content: (
            <div>
              <p className="mt-4">
                This chart is embedded. Do you want to continue?
              </p>
              <div className="flex gap-4 mt-6 justify-end">
                <CWOutlineButton
                  label="No"
                  onClick={() => {
                    setIsChartEmbedded(false);
                  }}
                  disabled={isDeleting}
                />
                <CWSolidLoadingButton
                  label="Yes"
                  onClick={() => {
                    deleteUserChart(deleteReqChartId.current, true);
                  }}
                  loadingLabel="Processing"
                  loading={isDeleting}
                  disabled={isDeleting}
                />
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
}

export default React.memo(UserCharts);
