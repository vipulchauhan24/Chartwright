import CWModal from '../../../components/modal';
import CWTextInput from '../../../components/textInput';
import { chartTitle, currentChartConfigStore } from '../../../../store/charts';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import axios from 'axios';
import CWButton from '../../../components/button';
import Spinner from '../../../components/spinner';
import { useNavigate, useParams } from 'react-router-dom';

interface ISaveChart {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SaveChart(props: ISaveChart) {
  const { id } = useParams();
  const { isOpen, setIsOpen } = props;
  const [chartDataConfig] = useAtom(currentChartConfigStore);
  const [chrtTitle, setChrtTitle] = useAtom(chartTitle);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const saveChartChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User not logged in.');
      }
      let saveChartPayload: any = {};
      if (id) {
        saveChartPayload = {
          id: id,
          title: chrtTitle,
          config: JSON.stringify(chartDataConfig),
          chart_type: `${chartDataConfig.options.chart.type}Chart`,
          updated_by: userId,
          updated_date: new Date().toISOString(),
        };
      } else {
        saveChartPayload = {
          title: chrtTitle,
          config: JSON.stringify(chartDataConfig),
          chart_type: `${chartDataConfig.options.chart.type}Chart`,
          created_by: userId,
          created_date: new Date().toISOString(),
        };
      }
      const response = await axios.post('/api/save-chart', saveChartPayload);
      closeModal();
      if (!id) {
        navigate(`/chart/${response.data.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [chartDataConfig, chrtTitle, closeModal, navigate, id]);

  const onChartTitleUpdate = (e: any) => {
    setChrtTitle(e.target.value || 'Chart Title');
  };

  return (
    <CWModal isOpen={isOpen} setIsOpen={setIsOpen} title="Save Chart">
      <div className="mt-4">
        <CWTextInput
          id="save-chart-input"
          label="Chart Title:"
          placeholder="Type title here..."
          defaultValue={chrtTitle}
          onChange={onChartTitleUpdate}
        />
        <div className="mt-4 flex items-center justify-end gap-2">
          <CWButton label="Cancel" onClick={closeModal} />
          <CWButton
            primary
            label={
              !isSaving ? (
                'Save'
              ) : (
                <span className="flex items-center justify-center w-full">
                  <Spinner />
                </span>
              )
            }
            onClick={saveChartChanges}
          />
        </div>
      </div>
    </CWModal>
  );
}

export default SaveChart;
