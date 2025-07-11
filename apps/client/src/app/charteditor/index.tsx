import { useAtom } from 'jotai';
import {
  fetchChartConfig,
  fetchChartGallery,
  setDefaultChartConfig,
} from '../../service/chartsApi';
import { chartGallery, loadingChartConfig } from '../../store/charts';
import { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import CWLink from '../components/link';
import Spinner from '../components/spinner';
import { SESSION_STORAGE_KEYS } from './utils/constants';
import CWButton from '../components/button';
import { isExportDisabled } from '../../store/app';
import { ChartArea, ChartPie, Save, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFromSessionStorage, storeInSessionStorage } from './utils/lib';
import useAuthentication from './hooks/useAuthentication';
import { useAuth } from 'react-oidc-context';

const AppShell = lazy(() => import('./layout/appshell'));
const ChartDataEditor = lazy(() => import('./containers/chartDataEditor'));
const ChartPreview = lazy(() => import('./containers/chartPreview'));
const GlobalOptionsEditor = lazy(
  () => import('./containers/globalOptionsEditor')
);
const ViewMyCharts = lazy(() => import('./containers/viewMyCharts'));
const SaveChart = lazy(() => import('./containers/saveChart'));
const ChartGallery = lazy(() => import('./containers/chartGallery'));
const ExportChart = lazy(() => import('./containers/export'));

function ChartEditor() {
  const { id } = useParams();
  const auth = useAuth();
  const { isAuthenticated } = useAuthentication();
  const [, fetchChartGalleryData] = useAtom(fetchChartGallery);
  const [exportDisabled] = useAtom(isExportDisabled);
  const [, getDefaultChartConfig] = useAtom(setDefaultChartConfig);
  const [chartGalleryData] = useAtom(chartGallery);
  const [isLoading] = useAtom(loadingChartConfig);
  const [showExportChartModal, setShowExportChartModal] = useState(false);
  const [, fetchDefaultChartConfig] = useAtom(fetchChartConfig);
  const [showChartGallery, setShowChartGallery] = useState(false);
  const [showSaveChartModal, setShowSaveChartModal] = useState(false);
  const [showMyCharts, setShowMyCharts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChartGalleryData(); // Fetch data on mount
  }, [fetchChartGalleryData]);

  useEffect(() => {
    if (chartGalleryData.length && !isLoading && !id) {
      const chartKey =
        fetchFromSessionStorage(SESSION_STORAGE_KEYS.GAL_CHART_ID) ||
        'simple-bar-chart';
      getDefaultChartConfig(chartKey);
    } else if (chartGalleryData.length && !isLoading && id) {
      fetchDefaultChartConfig(id);
    }
  }, [
    chartGalleryData,
    getDefaultChartConfig,
    isLoading,
    id,
    fetchDefaultChartConfig,
  ]);

  const exportChart = useCallback(() => {
    setShowExportChartModal(true);
  }, []);

  const openChartGallery = useCallback(() => {
    setShowChartGallery(true);
  }, []);

  const viewMyCharts = useCallback(() => {
    setShowMyCharts(true);
  }, []);

  const openSaveChartModal = useCallback(() => {
    setShowSaveChartModal(true);
  }, []);

  const onSetChartViaGalleryOptions = useCallback(
    (value: string) => {
      getDefaultChartConfig(value);
      storeInSessionStorage(SESSION_STORAGE_KEYS.GAL_CHART_ID, value);
      if (id) {
        navigate(`/chart`);
      }
    },
    [getDefaultChartConfig, navigate, id]
  );

  const redirectToLoginPage = useCallback(() => {
    auth.signinRedirect();
  }, [auth]);

  const chartUtitlityBtns = useMemo(() => {
    return [
      {
        tooltip: 'View chart templates',
        label: <ChartPie className="size-4" aria-hidden={true} />,
        onClick: openChartGallery,
      },
      {
        tooltip: 'Export',
        label: <Share2 className="size-4" aria-hidden={true} />,
        onClick: exportChart,
        disabled: exportDisabled,
      },
      {
        tooltip: 'View saved charts',
        label: <ChartArea className="size-4" aria-hidden={true} />,
        onClick: !isAuthenticated ? redirectToLoginPage : viewMyCharts,
      },
      {
        tooltip: 'Save changes',
        label: <Save className="size-4" aria-hidden={true} />,
        onClick: !isAuthenticated ? redirectToLoginPage : openSaveChartModal,
      },
    ];
  }, [
    exportChart,
    exportDisabled,
    isAuthenticated,
    openChartGallery,
    openSaveChartModal,
    redirectToLoginPage,
    viewMyCharts,
  ]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AppShell>
      <>
        <div className="flex items-start justify-between h-full">
          <aside className="w-1/5 min-w-80 h-full border-r border-border flex flex-col items-center">
            <div className="w-full h-full overflow-y-auto">
              <GlobalOptionsEditor />
            </div>
            <div className="p-4">
              <CWLink href="#" label="Need Help?" />
            </div>
          </aside>
          <div className="h-full w-full px-4 pb-4 overflow-auto">
            <div className="flex items-center justify-between pt-4 top-0 sticky z-50">
              <div className="flex items-center gap-2">
                {chartUtitlityBtns.map((btnConfig) => {
                  return (
                    <CWButton additionalCssClasses="py-2 px-3" {...btnConfig} />
                  );
                })}
              </div>
            </div>
            <ChartPreview />
          </div>
          <aside className="w-1/5 min-w-80 h-full border-l border-border overflow-y-auto">
            <ChartDataEditor />
          </aside>
        </div>
        <ExportChart
          isOpen={showExportChartModal}
          setIsOpen={setShowExportChartModal}
        />
        <ChartGallery
          isOpen={showChartGallery}
          setIsOpen={setShowChartGallery}
          onSetChartViaGalleryOptions={onSetChartViaGalleryOptions}
        />
        <SaveChart
          isOpen={showSaveChartModal}
          setIsOpen={setShowSaveChartModal}
        />
        <ViewMyCharts isOpen={showMyCharts} setIsOpen={setShowMyCharts} />
      </>
    </AppShell>
  );
}

export default ChartEditor;
