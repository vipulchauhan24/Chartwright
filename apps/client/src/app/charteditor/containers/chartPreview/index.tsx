import React, { useCallback, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useAtom } from 'jotai';
import { currentChartConfigStore } from '../../../../store/charts';
import { isExportDisabled } from '../../../../store/app';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import toast from 'react-hot-toast';
import {
  base64ImageToBase64PDF,
  copyToMemory,
  fileDownload,
} from '../../utils/lib';

const EXPORT_ERROR_MSG = 'Oops, try again later.';

function ChartPreview() {
  const [chartDataConfig] = useAtom(currentChartConfigStore);
  const chartRef = useRef(null);
  const chartInstance = useRef<echarts.EChartsType | undefined>(undefined);
  const [, setIsExportChartDisabled] = useAtom(isExportDisabled);

  const chartRenderFinished = useCallback(() => {
    setIsExportChartDisabled(false);
  }, [setIsExportChartDisabled]);

  useEffect(() => {
    chartInstance.current = echarts.init(chartRef.current);

    // Clean up on unmount
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartDataConfig) {
      return;
    }
    chartInstance.current?.on('finished', function () {
      chartRenderFinished();
    });
    chartInstance.current?.setOption({ ...chartDataConfig });
  }, [chartDataConfig, chartRenderFinished]);

  const generateImage = (
    type: 'png' | 'jpeg' | 'svg' | undefined = 'png'
  ): string => {
    if (!chartInstance.current) {
      throw new Error('Failed to generate image.');
    }
    const imgURI = chartInstance.current.getDataURL({
      type: type,
      backgroundColor: '#FFFFFF',
    });

    return imgURI;
  };

  const copyToClipboard = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const imgURI = await generateImage();
          const res = await fetch(imgURI); // Convert base64 to blob
          const blob = await res.blob();
          await copyToMemory({ [blob.type]: blob });
        } catch (err) {
          console.error('Failed to copy image:', err);
          throw err;
        }
      },
      {
        loading: 'Copying...',
        success: <b>Copied to clipboard!</b>,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, []);

  const downloadImage = useCallback(
    async (type: 'png' | 'jpeg' | 'svg' | undefined = 'png') => {
      toast.promise(
        async () => {
          try {
            const imgURI = await generateImage(type);
            fileDownload(`${imgURI}`, 'chart');
          } catch (err) {
            console.error('Failed to download image:', err);
            throw err;
          }
        },
        {
          loading: 'Downloading...',
          success: <b>Image downloaded successfully!</b>,
          error: <b>{EXPORT_ERROR_MSG}</b>,
        }
      );
    },
    []
  );

  const exportToPDF = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const imgURI = await generateImage();
          const pdfBase64 = await base64ImageToBase64PDF(`${imgURI}`);
          fileDownload(`${pdfBase64}`, 'chart');
        } catch (err) {
          console.error('Failed to download image:', err);
          throw err;
        }
      },
      {
        loading: 'Downloading...',
        success: <b>Image downloaded successfully!</b>,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, []);

  useEffect(() => {
    emitter.on(EVENTS.COPY_TO_CLIPBAORD, copyToClipboard);
    emitter.on(EVENTS.EXPORT_TO_PNG, () => {
      downloadImage();
    });
    emitter.on(EVENTS.EXPORT_TO_JPG, () => {
      downloadImage('jpeg');
    });
    emitter.on(EVENTS.EXPORT_TO_PDF, exportToPDF);
    // emitter.on(EVENTS.EXPORT_TO_SVG, exportToSVG);

    return () => {
      emitter.off(EVENTS.COPY_TO_CLIPBAORD, copyToClipboard);
      emitter.off(EVENTS.EXPORT_TO_PNG, () => {
        downloadImage();
      });
      emitter.off(EVENTS.EXPORT_TO_JPG, () => {
        downloadImage('jpeg');
      });
      emitter.off(EVENTS.EXPORT_TO_PDF, exportToPDF);
      // emitter.off(EVENTS.EXPORT_TO_SVG, exportToSVG);
    };
  }, [copyToClipboard, downloadImage, exportToPDF]);

  return (
    <div className="w-full h-[calc(100%_-_58px)] p-3 relative">
      {/* {!isChartRendered && (
        <div className="h-full w-full flex items-center justify-center animate-pulse bg-background rounded-xl">
          <ChartNoAxesCombined
            className="size-10 stroke-border"
            aria-hidden={true}
          />
        </div>
      )} */}
      <div ref={chartRef} className="h-full"></div>
    </div>
  );
}

export default React.memo(ChartPreview);
