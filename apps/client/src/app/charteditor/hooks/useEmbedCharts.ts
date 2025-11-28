import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { allEmbedChartDetails } from '../../../store/charts';
import { base64ToFile, EMBEDDABLES, fetchFromLocalStorage } from '../utils/lib';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../utils/constants';
import axios from 'axios';
import toast, { Renderable, Toast, ValueOrFunction } from 'react-hot-toast';

function useEmbedCharts() {
  const [, setAllEmbedChartData] = useAtom(allEmbedChartDetails);

  const [savingChanges, setSavingChanges] = useState({
    staticImage: false,
    iframe: false,
  });

  const uploadEmbeddableStaticImage = useCallback(
    async (params: {
      event: { uri: string };
      embedId: string;
      chartId: string;
      toastrConfig: {
        id: string;
        success: ValueOrFunction<Renderable, Toast>;
        loginError: ValueOrFunction<Renderable, Toast>;
        apiError: ValueOrFunction<Renderable, Toast>;
        error: ValueOrFunction<Renderable, Toast>;
      };
    }) => {
      const { event, embedId, chartId, toastrConfig } = params;

      setSavingChanges((prev: { staticImage: boolean; iframe: boolean }) => ({
        ...prev,
        staticImage: true,
      }));

      const { id, success, apiError, loginError, error } = toastrConfig;
      try {
        const userId = fetchFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
        if (!userId) {
          throw new Error('User not logged in.');
        } else if (!chartId) {
          throw new Error(
            'Chart not saved. Please save chart once or load any saved chart.'
          );
        }

        const formData = new FormData();
        formData.append('file', base64ToFile(event.uri));
        formData.append('type', EMBEDDABLES.STATIC_IMAGE);
        formData.append('chartId', chartId);

        if (!embedId) {
          formData.append('createdBy', userId);
          formData.append('createdDate', new Date().toISOString());
        } else {
          formData.append('id', embedId.split('?')[0]);
          formData.append('updatedBy', userId);
          formData.append('updatedDate', new Date().toISOString());
        }

        const response = await axios.put(
          `${API_ENDPOINTS.USER_CHARTS_EMBED}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setAllEmbedChartData((prev: any) => {
          return {
            ...prev,
            [`${chartId}`]: {
              ...prev[chartId],
              'static-image': response['data']['static-image'],
            },
          };
        });
        toast.success(success, {
          id: id,
        });
      } catch (err: any) {
        console.error('Error in uploadEmbeddableStaticImage:', err);
        if (err === loginError) {
          toast.error(loginError, {
            id: id,
          });
          return;
        } else if (err.status === 409) {
          toast.error(error, {
            id: id,
          });
          return;
        }
        toast.error(apiError, {
          id: id,
        });
      } finally {
        setSavingChanges((prev: { staticImage: boolean; iframe: boolean }) => ({
          ...prev,
          staticImage: false,
        }));
      }
    },
    [setAllEmbedChartData]
  );

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

  const deleteEmbeddedLink = useCallback(
    async (
      linkType: EMBEDDABLES,
      url: string,
      chart_id: string,
      toastrConfig: {
        loading: Renderable;
        success?: ValueOrFunction<Renderable, void> | undefined;
        error?: ValueOrFunction<Renderable, any> | undefined;
      }
    ) => {
      toast.promise(async () => {
        try {
          const id = `${url}`.split('/')[`${url}`.split('/').length - 1];
          await axios.delete(`/api/embed/${id}`);
          switch (linkType) {
            case EMBEDDABLES.STATIC_IMAGE:
              setAllEmbedChartData((prev: any) => {
                return {
                  ...prev,
                  [`${chart_id}`]: {
                    ...prev[chart_id],
                    'static-image': '',
                  },
                };
              });
              break;

            default:
              break;
          }
        } catch (err) {
          console.error('Failed to delete embed link:', err);
          throw err;
        }
      }, toastrConfig);
    },
    [setAllEmbedChartData]
  );

  return {
    savingChanges,
    uploadEmbeddableStaticImage,
    getAllEmbeddedDataByUserId,
    deleteEmbeddedLink,
  };
}

export default useEmbedCharts;
