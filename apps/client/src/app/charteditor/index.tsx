import { useAtom } from 'jotai';
import {
  fetchUserChartById,
  fetchChartTemplates,
  fetchAllChartsFeatures,
  fetchAllUserCharts,
  fetchAllChartBaseConfig,
} from '../../service/chartsApi';
import {
  chartId,
  chartTemplates,
  chartTitle,
  activeChartConfig,
  loadingChartConfig,
  allChartFeatures,
  activeChartFeatures,
  chartType,
  allChartBaseConfigLoading,
  allChartBaseConfigError,
} from '../../store/charts';
import React, { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { isExportDisabled } from '../../store/app';
import { ChartArea, ChartPie, FolderInput, Save, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import {
  CWGhostLink,
  CWOutlineButton,
  CWModal,
  CWSpinner,
} from '@chartwright/ui-components';
import toast from 'react-hot-toast';
import { fetchFromLocalStorage } from './utils/lib';
import { LOCAL_STORAGE_KEYS } from './utils/constants';
import useEmbedCharts from './hooks/useEmbedCharts';

const AppShell = lazy(() => import('./layout/appshell'));
const ChartDataEditor = lazy(() => import('./containers/chartDataEditor'));
const ChartPreview = lazy(() => import('./containers/chartPreview'));
const GlobalOptionsEditor = lazy(
  () => import('./containers/globalOptionsEditor')
);
const UserCharts = lazy(() => import('./containers/UserCharts'));
const SaveChart = lazy(() => import('./containers/saveChart'));
const ChartTemplates = lazy(() => import('./containers/chartTemplates'));
const ExportChart = lazy(() => import('./containers/export'));
const ImportData = lazy(() => import('./containers/importData'));

function ChartEditor() {
  const { chart_id } = useParams();
  const { isAuthenticated, signinRedirect } = useAuth();
  const navigate = useNavigate();

  const [, fetchUserCharts] = useAtom(fetchAllUserCharts);
  const [, fetchChartTemplatesData] = useAtom(fetchChartTemplates);
  const [, fetchChartFeaturesData] = useAtom(fetchAllChartsFeatures);
  const [exportDisabled] = useAtom(isExportDisabled);
  const [chartTemplatesData] = useAtom(chartTemplates);
  const [chartFeaturesData] = useAtom(allChartFeatures);
  const [, setActiveChartFeatures] = useAtom(activeChartFeatures);
  const [, setActiveChartConfig] = useAtom(activeChartConfig);
  const [, setChartTitle] = useAtom(chartTitle);
  const [, setChartType] = useAtom(chartType);
  const [, setChartId] = useAtom(chartId);
  const [isLoading] = useAtom(loadingChartConfig);
  const [, fetchActiveChartConfig] = useAtom(fetchUserChartById);
  const [, fetchAllChartBaseConfigData] = useAtom(fetchAllChartBaseConfig);
  const [isAllChartBaseConfigLoading] = useAtom(allChartBaseConfigLoading);
  const [isAllChartBaseConfigError] = useAtom(allChartBaseConfigError);

  const { getAllEmbeddedDataByUserId } = useEmbedCharts();

  const [isExportDialogVisible, setIsExportDialogVisible] = useState(false);
  const [isChartTemplateVisible, setIsChartTemplateVisible] = useState(false);
  const [showSaveChartModal, setShowSaveChartModal] = useState(false);
  const [isUserChartsVisible, setIsUserChartsVisible] = useState(false);
  const [isImportDialogVisible, setIsImportDialogVisible] = useState(false);

  useEffect(() => {
    if (
      !fetchAllChartBaseConfigData ||
      !fetchChartFeaturesData ||
      !fetchChartTemplatesData
    ) {
      return;
    }
    // Fetch data on mount
    fetchChartTemplatesData();
    fetchChartFeaturesData();
    fetchAllChartBaseConfigData();
  }, [
    fetchAllChartBaseConfigData,
    fetchChartFeaturesData,
    fetchChartTemplatesData,
  ]);

  useEffect(() => {
    const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
    if (userId) {
      fetchUserCharts(userId);
      getAllEmbeddedDataByUserId();
    }
  }, [fetchUserCharts, getAllEmbeddedDataByUserId, isAuthenticated]);

  useEffect(() => {
    if (!isLoading && !chart_id) {
      if (!chartTemplatesData?.length) {
        return;
      }
      setActiveChartConfig(chartTemplatesData[0]['config']);
      setChartTitle(chartTemplatesData[0]['name']);
      setChartId(chartTemplatesData[0]['chart_id']);
      const chartType = chartTemplatesData[0]['type'];
      setChartType(chartType);
      for (const features of chartFeaturesData) {
        if (features['type'] === chartType) {
          setActiveChartFeatures(features['config']);
          break;
        }
      }
    } else if (!isLoading && chart_id) {
      fetchActiveChartConfig(chart_id);
    }
  }, [
    chartTemplatesData,
    chartFeaturesData,
    isLoading,
    chart_id,
    setActiveChartConfig,
    setChartTitle,
    setChartId,
    setActiveChartFeatures,
    setChartType,
    fetchActiveChartConfig,
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

  const toggleUserChartsView = useCallback((open: boolean) => {
    setIsUserChartsVisible(open);
  }, []);

  const toggleSaveChartModal = useCallback((open: boolean) => {
    setShowSaveChartModal(open);
  }, []);

  const onTemplateChange = useCallback(
    (name: string) => {
      navigate('/chart');
      setTimeout(() => {
        const template = chartTemplatesData.find(
          (temp) => temp['name'] === name
        );
        if (template) {
          setActiveChartConfig(template['config']);
          setChartTitle(template['name']);
          setChartId(template['id']);
          const chartType = template['type'];
          setChartType(chartType);
          for (const features of chartFeaturesData) {
            if (features['type'] === chartType) {
              setActiveChartFeatures(features['config']);
              break;
            }
          }
        } else {
          toast.error('Oops! Chart template could not be loaded.');
        }
        toggleChartTemplateModal(false);
      }, 100);
    },
    [
      chartFeaturesData,
      chartTemplatesData,
      navigate,
      setActiveChartConfig,
      setActiveChartFeatures,
      setChartId,
      setChartTitle,
      setChartType,
      toggleChartTemplateModal,
    ]
  );

  const chartUtitlityBtns = useMemo(() => {
    return [
      {
        tooltip: 'Import from file',
        iconLeft: <FolderInput className="size-4" aria-hidden={true} />,
        onClick: () => {
          toggleImportDataModal(true);
        },
        isLoading: isAllChartBaseConfigLoading,
        disabled: isAllChartBaseConfigError,
      },
      {
        tooltip: 'Export',
        iconLeft: <Share2 className="size-4" aria-hidden={true} />,
        onClick: () => {
          toggleExportDataModal(true);
        },
        isLoading: exportDisabled,
        disabled: exportDisabled,
      },
    ];
  }, [
    isAllChartBaseConfigLoading,
    isAllChartBaseConfigError,
    exportDisabled,
    toggleImportDataModal,
    toggleExportDataModal,
  ]);

  const onSavingUserChartRequest = useCallback(() => {
    if (!isAuthenticated) {
      signinRedirect();
      return;
    }
    toggleSaveChartModal(true);
  }, [isAuthenticated, signinRedirect, toggleSaveChartModal]);

  const chartUtitlityAuthoredBtns = useMemo(() => {
    return [
      {
        tooltip: 'View chart templates',
        iconLeft: <ChartPie className="size-4" aria-hidden={true} />,
        onClick: () => {
          toggleChartTemplateModal(true);
        },
      },
      {
        tooltip: 'View saved charts',
        iconLeft: <ChartArea className="size-4" aria-hidden={true} />,
        onClick: !isAuthenticated
          ? () => {
              signinRedirect();
            }
          : () => {
              toggleUserChartsView(true);
            },
      },
      {
        tooltip: 'Save changes',
        iconLeft: <Save className="size-4" aria-hidden={true} />,
        onClick: onSavingUserChartRequest,
      },
    ];
  }, [
    isAuthenticated,
    onSavingUserChartRequest,
    signinRedirect,
    toggleChartTemplateModal,
    toggleUserChartsView,
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
        title: 'Chart Templates',
        content: <ChartTemplates onTemplateChange={onTemplateChange} />,
        fullScreen: true,
      };
    } else if (isUserChartsVisible) {
      return {
        open: isUserChartsVisible,
        setOpen: toggleUserChartsView,
        title: 'My Saved Charts',
        content: <UserCharts toggleUserChartsView={toggleUserChartsView} />,
        fullScreen: true,
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
      open: false,
      setOpen: () => {
        return;
      },
      title: '',
      content: '',
    };
  }, [
    isImportDialogVisible,
    isExportDialogVisible,
    isChartTemplateVisible,
    isUserChartsVisible,
    showSaveChartModal,
    toggleImportDataModal,
    toggleExportDataModal,
    toggleChartTemplateModal,
    onTemplateChange,
    toggleUserChartsView,
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
                    <CWOutlineButton
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
                    <CWOutlineButton
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
        <CWModal {...modalProps} />
      </>
    </AppShell>
  );
}

export default React.memo(ChartEditor);
