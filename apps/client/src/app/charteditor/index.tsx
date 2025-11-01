import { useAtom } from 'jotai';
import {
  fetchChartConfig,
  fetchChartTemplates,
  fetchChartFeatures,
  setInitChartData,
} from '../../service/chartsApi';
import {
  chartId,
  chartTemplates,
  chartTitle,
  currentChartConfigStore,
  loadingChartConfig,
} from '../../store/charts';
import React, { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { isExportDisabled } from '../../store/app';
import { ChartArea, ChartPie, FolderInput, Save, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import useAuthentication from './hooks/useAuthentication';
import { useAuth } from 'react-oidc-context';
import {
  CWGhostLink,
  CWIconOutlineButton,
  CWModal,
  CWSpinner,
} from '@chartwright/ui-components';

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

  const [, fetchChartTemplatesData] = useAtom(fetchChartTemplates);
  const [, fetchChartFeaturesData] = useAtom(fetchChartFeatures);
  const [exportDisabled] = useAtom(isExportDisabled);
  // const [, getInitChartData] = useAtom(setInitChartData);
  const [chartTemplatesData] = useAtom(chartTemplates);
  const [, setCurrentChartConfigStore] = useAtom(currentChartConfigStore);
  const [, setChartTitle] = useAtom(chartTitle);
  const [, setChartId] = useAtom(chartId);
  const [isLoading] = useAtom(loadingChartConfig);
  const [, fetchDefaultChartConfig] = useAtom(fetchChartConfig);

  const [isExportDialogVisible, setIsExportDialogVisible] = useState(false);
  const [isChartTemplateVisible, setIsChartTemplateVisible] = useState(false);
  const [showSaveChartModal, setShowSaveChartModal] = useState(false);
  const [isMyChartModalVisible, setIsMyChartModalVisible] = useState(false);
  const [isImportDialogVisible, setIsImportDialogVisible] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    fetchChartTemplatesData(); // Fetch data on mount
  }, [fetchChartTemplatesData]);

  useEffect(() => {
    fetchChartFeaturesData(); // Fetch data on mount
  }, [fetchChartFeaturesData]);

  useEffect(() => {
    if (chartTemplatesData.length && !isLoading && !id) {
      setCurrentChartConfigStore(chartTemplatesData[0]['config']);
      setChartTitle(chartTemplatesData[0]['name']);
      setChartId(chartTemplatesData[0]['id']);
    } else if (chartTemplatesData.length && !isLoading && id) {
      fetchDefaultChartConfig(id);
    }
  }, [
    chartTemplatesData,
    isLoading,
    id,
    fetchDefaultChartConfig,
    setCurrentChartConfigStore,
    setChartTitle,
    setChartId,
  ]);

  const toggleImportDataModal = useCallback((open: boolean) => {
    setIsImportDialogVisible(open);
  }, []);

  const toggleExportDataModal = useCallback((open: boolean) => {
    setIsExportDialogVisible(open);
  }, []);

  const toggleChartTemplateModal = useCallback((open: boolean) => {
    setIsChartTemplateVisible(open);
  }, []);

  const toggleMyChartsModal = useCallback((open: boolean) => {
    setIsMyChartModalVisible(open);
  }, []);

  const toggleSaveChartModal = useCallback((open: boolean) => {
    setShowSaveChartModal(open);
  }, []);

  // const onSetChartViaGalleryOptions = useCallback(
  //   (value: string) => {
  //     getInitChartData(value);
  //     if (id) {
  //       navigate(`/chart`);
  //     }
  //   },
  //   [getInitChartData, navigate, id]
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
        onClick: !isAuthenticated
          ? redirectToLoginPage
          : () => {
              toggleMyChartsModal(true);
            },
      },
      {
        tooltip: 'Save changes',
        icon: <Save className="size-4" aria-hidden={true} />,
        onClick: !isAuthenticated
          ? redirectToLoginPage
          : () => {
              toggleSaveChartModal(true);
            },
      },
    ];
  }, [
    isAuthenticated,
    redirectToLoginPage,
    toggleSaveChartModal,
    toggleChartTemplateModal,
    toggleMyChartsModal,
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
    } else if (isMyChartModalVisible) {
      return {
        open: isMyChartModalVisible,
        setOpen: toggleMyChartsModal,
        title: 'My Saved Charts',
        content: <ViewMyCharts toggleMyChartsModal={toggleMyChartsModal} />,
      };
    } else if (showSaveChartModal) {
      return {
        open: showSaveChartModal,
        setOpen: toggleSaveChartModal,
        title: 'Save Chart',
        content: <SaveChart toggleSaveChartModal={toggleSaveChartModal} />,
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
    isMyChartModalVisible,
    showSaveChartModal,
    toggleImportDataModal,
    toggleExportDataModal,
    toggleChartTemplateModal,
    toggleMyChartsModal,
    toggleSaveChartModal,
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
        {/* <SaveChart
          isOpen={showSaveChartModal}
          setIsOpen={setShowSaveChartModal}
        /> */}
        <CWModal {...modalProps} />
      </>
    </AppShell>
  );
}

export default React.memo(ChartEditor);
