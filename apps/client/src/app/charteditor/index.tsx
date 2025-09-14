import { useAtom } from 'jotai';
import {
  fetchChartConfig,
  fetchChartGallery,
  fetchChartGlobalOptions,
  setDefaultChartConfig,
} from '../../service/chartsApi';
import { chartGallery, loadingChartConfig } from '../../store/charts';
import React, { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { isExportDisabled } from '../../store/app';
import { ChartArea, ChartPie, FolderInput, Save, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthentication from './hooks/useAuthentication';
import { useAuth } from 'react-oidc-context';
import {
  CWGhostLink,
  CWIconOutlineButton,
  CWModal,
  CWSpinner,
} from '@chartwright/core-components';

const AppShell = lazy(() => import('./layout/appshell'));
const ChartDataEditor = lazy(() => import('./containers/chartDataEditor'));
const ChartPreview = lazy(() => import('./containers/chartPreview'));
const GlobalOptionsEditor = lazy(
  () => import('./containers/globalOptionsEditor')
);
const ViewMyCharts = lazy(() => import('./containers/viewMyCharts'));
const SaveChart = lazy(() => import('./containers/saveChart'));
const ChartTemplates = lazy(() => import('./containers/chartTemplates'));
const ExportChart = lazy(() => import('./containers/export'));
const ImportData = lazy(() => import('./containers/importData'));

function ChartEditor() {
  const { id } = useParams();
  const auth = useAuth();
  const { isAuthenticated } = useAuthentication();

  const [, fetchChartGalleryData] = useAtom(fetchChartGallery);
  const [, fetchChartGlobalData] = useAtom(fetchChartGlobalOptions);
  const [exportDisabled] = useAtom(isExportDisabled);
  const [, getDefaultChartConfig] = useAtom(setDefaultChartConfig);
  const [chartGalleryData] = useAtom(chartGallery);
  const [isLoading] = useAtom(loadingChartConfig);
  const [, fetchDefaultChartConfig] = useAtom(fetchChartConfig);

  const [isExportDialogVisible, setIsExportDialogVisible] = useState(false);
  const [isChartTemplateVisible, setIsChartTemplateVisible] = useState(false);
  const [showSaveChartModal, setShowSaveChartModal] = useState(false);
  const [showMyCharts, setShowMyCharts] = useState(false);
  const [isImportDialogVisible, setIsImportDialogVisible] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    fetchChartGalleryData(); // Fetch data on mount
  }, [fetchChartGalleryData]);

  useEffect(() => {
    fetchChartGlobalData(); // Fetch data on mount
  }, [fetchChartGlobalData]);

  useEffect(() => {
    if (chartGalleryData.length && !isLoading && !id) {
      getDefaultChartConfig('simple-bar-chart');
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

  const viewMyCharts = useCallback(() => {
    setShowMyCharts(true);
  }, []);

  const openSaveChartModal = useCallback(() => {
    setShowSaveChartModal(true);
  }, []);

  const toggleImportDataModal = useCallback((open: boolean) => {
    setIsImportDialogVisible(open);
  }, []);

  const toggleExportDataModal = useCallback((open: boolean) => {
    setIsExportDialogVisible(open);
  }, []);

  const toggleChartTemplateModal = useCallback((open: boolean) => {
    setIsChartTemplateVisible(open);
  }, []);

  // const onSetChartViaGalleryOptions = useCallback(
  //   (value: string) => {
  //     getDefaultChartConfig(value);
  //     if (id) {
  //       navigate(`/chart`);
  //     }
  //   },
  //   [getDefaultChartConfig, navigate, id]
  // );

  const redirectToLoginPage = useCallback(() => {
    auth.signinRedirect();
  }, [auth]);

  const chartUtitlityBtns = useMemo(() => {
    return [
      {
        tooltip: 'Import from file',
        icon: <FolderInput className="size-4" aria-hidden={true} />,
        onClick: () => {
          toggleImportDataModal(true);
        },
      },
      {
        tooltip: 'Export',
        icon: <Share2 className="size-4" aria-hidden={true} />,
        onClick: () => {
          toggleExportDataModal(true);
        },
        disabled: exportDisabled,
      },
    ];
  }, [exportDisabled, toggleImportDataModal, toggleExportDataModal]);

  const chartUtitlityAuthoredBtns = useMemo(() => {
    return [
      {
        tooltip: 'View chart templates',
        icon: <ChartPie className="size-4" aria-hidden={true} />,
        onClick: () => {
          toggleChartTemplateModal(true);
        },
      },
      {
        tooltip: 'View saved charts',
        icon: <ChartArea className="size-4" aria-hidden={true} />,
        onClick: !isAuthenticated ? redirectToLoginPage : viewMyCharts,
      },
      {
        tooltip: 'Save changes',
        icon: <Save className="size-4" aria-hidden={true} />,
        onClick: !isAuthenticated ? redirectToLoginPage : openSaveChartModal,
      },
    ];
  }, [
    isAuthenticated,
    toggleChartTemplateModal,
    openSaveChartModal,
    redirectToLoginPage,
    viewMyCharts,
  ]);

  const modalProps = useMemo(() => {
    if (isImportDialogVisible) {
      return {
        open: isImportDialogVisible,
        setOpen: toggleImportDataModal,
        title: 'Import Data',
        content: <ImportData toggleImportDataModal={toggleImportDataModal} />,
      };
    } else if (isExportDialogVisible) {
      return {
        open: isExportDialogVisible,
        setOpen: toggleExportDataModal,
        title: 'Export Chart',
        content: <ExportChart />,
      };
    } else if (isChartTemplateVisible) {
      return {
        open: isChartTemplateVisible,
        setOpen: toggleChartTemplateModal,
        title: 'Chart Template',
        content: (
          <ChartTemplates toggleChartTemplateModal={toggleChartTemplateModal} />
        ),
        fullScreen: true,
      };
    }

    return {
      open: isImportDialogVisible,
      setOpen: toggleImportDataModal,
      title: 'Import Data',
      content: <ImportData toggleImportDataModal={toggleImportDataModal} />,
    };
  }, [
    isImportDialogVisible,
    isExportDialogVisible,
    isChartTemplateVisible,
    toggleImportDataModal,
    toggleExportDataModal,
    toggleChartTemplateModal,
  ]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <CWSpinner />
      </div>
    );
  }

  return (
    <AppShell>
      <>
        <div className="flex items-start justify-between h-full">
          <aside className="w-1/5 min-w-80 h-full border-r border-default flex flex-col items-center">
            <div className="w-full h-full overflow-y-auto">
              <GlobalOptionsEditor />
            </div>
            <div className="p-4">
              <CWGhostLink href="#" label="Need Help?" />
            </div>
          </aside>
          <div className="h-full w-full px-4 pb-4 overflow-auto">
            <div className="flex items-center justify-between pt-4 top-0 sticky z-50">
              <div className="flex items-center gap-2">
                {chartUtitlityBtns.map((btnConfig) => {
                  return (
                    <CWIconOutlineButton
                      {...btnConfig}
                      key={btnConfig.tooltip}
                      aria-label={btnConfig.tooltip}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                {chartUtitlityAuthoredBtns.map((btnConfig) => {
                  return (
                    <CWIconOutlineButton
                      {...btnConfig}
                      key={btnConfig.tooltip}
                      aria-label={btnConfig.tooltip}
                    />
                  );
                })}
              </div>
            </div>
            <ChartPreview />
          </div>
          <aside className="w-1/5 min-w-80 h-full border-l border-default overflow-y-auto">
            <ChartDataEditor />
          </aside>
        </div>
        <SaveChart
          isOpen={showSaveChartModal}
          setIsOpen={setShowSaveChartModal}
        />
        <ViewMyCharts isOpen={showMyCharts} setIsOpen={setShowMyCharts} />
        <CWModal {...modalProps} />
      </>
    </AppShell>
  );
}

export default React.memo(ChartEditor);
