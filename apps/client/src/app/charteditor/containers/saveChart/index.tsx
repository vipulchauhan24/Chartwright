import {
  chartTitle,
  activeChartConfig,
  chartType,
} from '../../../../store/charts';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../../utils/constants';
import { fetchAllUserCharts } from '../../../../service/chartsApi';
import {
  CWOutlineButton,
  CWSolidLoadingButton,
  CWTextInput,
} from '@chartwright/ui-components';
import toast from 'react-hot-toast';
import { api } from '../../../api-client';
import { useAuth } from 'react-oidc-context';

interface ISaveChart {
  toggleSaveChartModal: (open: boolean) => void;
}

interface ISaveChartPayload {
  id?: string;
  title: string;
  config: string;
  chartType: string;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}

function SaveChart(props: ISaveChart) {
  const { toggleSaveChartModal } = props;

  const { chart_id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [, fetchAllCharts] = useAtom(fetchAllUserCharts);
  const [chartDataConfig] = useAtom(activeChartConfig);
  const [chrtTitle, setChrtTitle] = useAtom(chartTitle);
  const [chrtType] = useAtom(chartType);

  const [isSaving, setIsSaving] = useState(false);

  const closeModal = useCallback(() => {
    toggleSaveChartModal(false);
  }, [toggleSaveChartModal]);

  const saveChartChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      if (!isAuthenticated) {
        throw new Error('User not logged in.');
      }
      let saveChartPayload: ISaveChartPayload = {
        title: chrtTitle,
        config: JSON.stringify(chartDataConfig),
        chartType: `${chrtType}`,
      };
      if (chart_id) {
        saveChartPayload = {
          ...saveChartPayload,
          id: chart_id,
          updatedDate: new Date().toISOString(),
        };
      } else {
        saveChartPayload = {
          ...saveChartPayload,
          createdDate: new Date().toISOString(),
        };
      }
      const response = await api.instance.put(
        API_ENDPOINTS.USER_CHARTS,
        saveChartPayload
      );
      fetchAllCharts();
      closeModal();
      toast.success('Changes saved.');
      if (!chart_id) {
        navigate(`/chart/${response.data.id}`);
      }
    } catch (error: any) {
      switch (error.status) {
        case 429:
          toast.error('Usage limit reached.');
          break;

        default:
          toast.error('Oops! Chart could not be saved.');
          break;
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    isAuthenticated,
    chrtTitle,
    chartDataConfig,
    chrtType,
    chart_id,
    fetchAllCharts,
    closeModal,
    navigate,
  ]);

  const onChartTitleUpdate = (e: any) => {
    setChrtTitle(e.target.value || 'Chart Title');
  };

  return (
    <div className="mt-4">
      <CWTextInput
        id="save-chart-input"
        label="Chart Title:"
        placeholder="Type title here..."
        defaultValue={chrtTitle}
        onChange={onChartTitleUpdate}
      />
      <div className="mt-4 flex items-center justify-end gap-2">
        <div className="flex gap-4 mt-6">
          <CWOutlineButton
            label="Cancel"
            onClick={closeModal}
            disabled={isSaving}
          />
          <CWSolidLoadingButton
            label="Save"
            onClick={saveChartChanges}
            loadingLabel="Saving"
            loading={isSaving}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

export default SaveChart;
