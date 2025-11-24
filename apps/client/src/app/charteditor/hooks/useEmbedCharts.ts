import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { allEmbedChartDetails } from '../../../store/charts';
import { fetchFromLocalStorage } from '../utils/lib';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../utils/constants';
import axios from 'axios';

function useEmbedCharts() {
  const [, setAllEmbedChartData] = useAtom(allEmbedChartDetails);

  const getAllEmbeddedDataByUserId = useCallback(async () => {
    try {
      const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
      if (!userId) {
        throw new Error('User not logged in.');
      }

      const response = await axios.get(
        `${API_ENDPOINTS.USER_CHARTS_EMBED}/${userId}`
      );

      setAllEmbedChartData((prev: any) => {
        return {
          ...prev,
          ...response['data'],
        };
      });
    } catch (err) {
      console.error('Failed to embed image:', err);
    }
  }, [setAllEmbedChartData]);

  return [getAllEmbeddedDataByUserId];
}

export default useEmbedCharts;
