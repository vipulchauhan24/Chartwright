import {
  chartTitle,
  activeChartConfig,
  chartType,
} from '../../../../store/charts';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFromLocalStorage } from '../../utils/lib';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { fetchAllUserCharts } from '../../../../service/chartsApi';
import {
  CWOutlineButton,
  CWSolidLoadingButton,
  CWTextInput,
} from '@chartwright/ui-components';
import toast from 'react-hot-toast';

interface ISaveChart {
  toggleSaveChartModal: (open: boolean) => void;
}

interface ISaveChartPayload {
  id?: string;
  title: string;
  config: string;
  chart_type: string;
  created_by?: string;
  created_date?: string;
  updated_by?: string;
  updated_date?: string;
}

function SaveChart(props: ISaveChart) {
  const { id } = useParams();
  const { toggleSaveChartModal } = props;
  const [, fetchAllCharts] = useAtom(fetchAllUserCharts);
  const [chartDataConfig] = useAtom(activeChartConfig);
  const [chrtTitle, setChrtTitle] = useAtom(chartTitle);
  const [chrtType] = useAtom(chartType);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const closeModal = useCallback(() => {
    toggleSaveChartModal(false);
  }, [toggleSaveChartModal]);

  const saveChartChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
      if (!userId) {
        throw new Error('User not logged in.');
      }
      let saveChartPayload: ISaveChartPayload = {
        title: chrtTitle,
        config: JSON.stringify(chartDataConfig),
        chart_type: `${chrtType}`,
      };
      if (id) {
        saveChartPayload = {
          ...saveChartPayload,
          id: id,
          updated_by: userId,
          updated_date: new Date().toISOString(),
        };
      } else {
        saveChartPayload = {
          ...saveChartPayload,
          created_by: userId,
          created_date: new Date().toISOString(),
        };
      }
      const response = await axios.put(
        API_ENDPOINTS.USER_CHARTS,
        saveChartPayload
      );
      fetchAllCharts(userId);
      closeModal();
      toast.success('Changes saved.');
      if (!id) {
        navigate(`/chart/${response.data.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Oops! Chart could not be saved.');
    } finally {
      setIsSaving(false);
    }
  }, [
    chrtTitle,
    chartDataConfig,
    chrtType,
    id,
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
