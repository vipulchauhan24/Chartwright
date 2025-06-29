import { useAtom } from 'jotai';
import AppShell from './layout/appshell';
import {
  fetchChartConfig,
  fetchChartGallery,
  setDefaultChartConfig,
} from '../../service/chartsApi';
import { chartGallery, loadingChartConfig } from '../../store/charts';
import { useCallback, useEffect, useState } from 'react';
import ChartRenderer from './containers/chartRenderer';
import GlobalOptionsEditor from './containers/globalOptionsEditor';
import CWLink from '../components/link';
import Spinner from '../components/spinner';
import ChartDataEditor from './containers/chartDataEditor';
import CWDropdown from '../components/dropdown';
import { SESSION_STORAGE_KEYS, simpleChartTypes } from './utils/constants';
import CWButton from '../components/button';
import ExportChart from './containers/export';
import ChartGallery from './containers/chartGallery';
import { isExportDisabled } from '../../store/app';
import { ChartArea, ChartPie, Save, Share2 } from 'lucide-react';
import SaveChart from './containers/saveChart';
import { useNavigate, useParams } from 'react-router-dom';
import ViewMyCharts from './containers/viewMyCharts';
import { fetchFromSessionStorage, storeInSessionStorage } from './utils/lib';
import Tippy from '@tippyjs/react';
import useAuthentication from './hooks/useAuthentication';

function ChartEditor() {
  const { id } = useParams();
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
  const [chartSelectedIndx, setChartSelectedIndx] = useState(0);
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
      for (const indx in simpleChartTypes) {
        if (simpleChartTypes[indx].value === chartKey) {
          setChartSelectedIndx(Number(indx));
          break;
        }
      }
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

  const onChangeChartRequest = useCallback(
    (value: string) => {
      getDefaultChartConfig(value);
    },
    [getDefaultChartConfig]
  );

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
      for (const indx in simpleChartTypes) {
        if (simpleChartTypes[indx].value === value) {
          setChartSelectedIndx(Number(indx));
          break;
        }
      }
      storeInSessionStorage(SESSION_STORAGE_KEYS.GAL_CHART_ID, value);
      if (id) {
        navigate(`/chart`);
      }
    },
    [getDefaultChartConfig, navigate, id]
  );

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
                <CWButton
                  additionalCssClasses="py-2 px-3"
                  tooltip="Open Chart Gallery"
                  label={<ChartPie className="size-4" aria-hidden={true} />}
                  onClick={openChartGallery}
                />
                {isAuthenticated && (
                  <CWButton
                    additionalCssClasses="py-2 px-3"
                    tooltip="Saved Charts"
                    label={<ChartArea className="size-4" aria-hidden={true} />}
                    onClick={viewMyCharts}
                  />
                )}
                {isAuthenticated && (
                  <CWButton
                    additionalCssClasses="py-2 px-3"
                    tooltip="Saved Changes"
                    label={<Save className="size-4" aria-hidden={true} />}
                    onClick={openSaveChartModal}
                  />
                )}
                {!exportDisabled && (
                  <CWButton
                    additionalCssClasses="py-2 px-3"
                    tooltip="Export"
                    label={<Share2 className="size-4" aria-hidden={true} />}
                    onClick={exportChart}
                  />
                )}
              </div>
              <CWDropdown
                items={simpleChartTypes}
                onChange={onChangeChartRequest}
                selectedIndex={chartSelectedIndx}
              />
            </div>
            <ChartRenderer />
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
