import { chartTitle, currentChartConfigStore } from '../../../../store/charts';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFromLocalStorage } from '../../utils/lib';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { fetchMyCharts } from '../../../../service/chartsApi';
import {
  CWOutlineButton,
  CWSolidLoadingButton,
  CWTextInput,
} from '@chartwright/ui-components';

interface ISaveChart {
  toggleSaveChartModal: (open: boolean) => void;
}

function SaveChart(props: ISaveChart) {
  const { id } = useParams();
  const { toggleSaveChartModal } = props;
  const [, fetchCharts] = useAtom(fetchMyCharts);
  const [chartDataConfig] = useAtom(currentChartConfigStore);
  const [chrtTitle, setChrtTitle] = useAtom(chartTitle);
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
      let saveChartPayload: any = {};
      if (id) {
        saveChartPayload = {
          id: id,
          title: chrtTitle,
          config: JSON.stringify(chartDataConfig),
          chart_type: `${chartDataConfig.chart.type}Chart`,
          updated_by: userId,
          updated_date: new Date().toISOString(),
        };
      } else {
        saveChartPayload = {
          title: chrtTitle,
          config: JSON.stringify(chartDataConfig),
          chart_type: `${chartDataConfig.chart.type}Chart`,
          created_by: userId,
          created_date: new Date().toISOString(),
        };
      }
      const response = await axios.post('/api/save-chart', saveChartPayload);
      fetchCharts(userId);
      closeModal();
      if (!id) {
        navigate(`/chart/${response.data.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [id, fetchCharts, closeModal, chrtTitle, chartDataConfig, navigate]);

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
