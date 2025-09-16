import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { ChartNoAxesCombined } from 'lucide-react';

import { ChartRenderer } from '@chartwright/chart-renderer';

const EXPORT_ERROR_MSG = 'Oops, try again later.';

function ChartPreview() {
  const [chartDataConfig] = useAtom(currentChartConfigStore);
  const chartRef = useRef(null);
  const chartInstance = useRef<echarts.EChartsType | undefined>(undefined);
  const [, setIsExportChartDisabled] = useAtom(isExportDisabled);
  const [isChartRendered, setIsChartRendered] = useState(false);

  const chartRenderFinished = useCallback(() => {
    setIsExportChartDisabled(false);
    setIsChartRendered(true);
  }, [setIsExportChartDisabled]);

  useEffect(() => {
    if (!chartDataConfig) {
      return;
    }
    // chartInstance.current = echarts.init(chartRef.current);

    const renderer = new ChartRenderer('echarts-container');
    setTimeout(() => {
      renderer.sendMessage({
        type: 'render',
        option: chartDataConfig,
      });
    }, 2000);
    // Clean up on unmount
    return () => {
      // chartInstance.current?.dispose();
    };
  }, [chartDataConfig]);

  useEffect(() => {
    if (!chartDataConfig || !chartInstance.current) {
      return;
    }
    chartInstance.current?.on('finished', function () {
      chartRenderFinished();
    });
    chartInstance.current?.setOption(chartDataConfig, {
      notMerge: true,
      lazyUpdate: true,
      silent: true,
    });
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
    <div className="w-full h-[calc(100%_-_58px)] pt-3 relative">
      {/* {!isChartRendered && (
        <div className="h-full w-full flex items-center justify-center z-10 bg-axis/50 absolute top-3 left-0 rounded-lg">
          <ChartNoAxesCombined
            className="size-10 stroke-border animate-pulse"
            aria-hidden={true}
          />
        </div>
      )}
      <div
        ref={chartRef}
        className="h-full bg-surface p-4 rounded-lg overflow-hidden shadow-toolbar"
      ></div> */}
      <div
        id="echarts-container"
        className="h-full bg-surface p-2.5 rounded-sm overflow-hidden shadow-[rgba(0, 0, 0, 0.1) 0px 0px 20px] box-border"
      ></div>
    </div>
  );
}

export default React.memo(ChartPreview);
