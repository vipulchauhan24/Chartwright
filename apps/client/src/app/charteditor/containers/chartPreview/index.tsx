import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { activeChartConfig } from '../../../../store/charts';
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

const CHART_CONTAINER_ID = 'echarts-container';

function ChartPreview() {
  const [chartDataConfig] = useAtom(activeChartConfig);
  const chartRendererInst = useRef<ChartRenderer>(undefined);
  const [, setIsExportChartDisabled] = useAtom(isExportDisabled);
  const [isChartRendered, setIsChartRendered] = useState(false);

  const chartRenderFinished = useCallback(() => {
    setIsExportChartDisabled(false);
    setIsChartRendered(true);
  }, [setIsExportChartDisabled]);

  const renderChart = useCallback(() => {
    chartRendererInst.current?.renderChart(chartDataConfig);
  }, [chartDataConfig]);

  const downloadChart = useCallback(async (event: any) => {
    const { uriType, copy, pdf, imageURI } = event.detail;

    const actions: Record<string, () => Promise<void>> = {
      downloadImage: async () => {
        fileDownload(imageURI, 'chart');
      },
      copyImage: async () => {
        const res = await fetch(imageURI); // base64 → blob
        const blob = await res.blob();
        await copyToMemory({ [blob.type]: blob });
      },
      downloadPDF: async () => {
        const pdfBase64 = await base64ImageToBase64PDF(imageURI);
        fileDownload(`${pdfBase64}`, 'chart');
      },
    };

    let actionKey: keyof typeof actions | null = null;
    let messages = { loading: '', success: <>Success!</> };

    if ((uriType === 'png' || uriType === 'jpeg') && !copy && !pdf) {
      actionKey = 'downloadImage';
      messages = {
        loading: 'Downloading...',
        success: <b>Image downloaded successfully!</b>,
      };
    } else if (uriType === 'png' && copy) {
      actionKey = 'copyImage';
      messages = {
        loading: 'Copying...',
        success: <b>Copied to clipboard!</b>,
      };
    } else if (uriType === 'png' && pdf) {
      actionKey = 'downloadPDF';
      messages = {
        loading: 'Downloading...',
        success: <b>Image downloaded successfully!</b>,
      };
    }

    if (!actionKey) return;

    toast.promise(
      async () => {
        try {
          await actions[actionKey]();
        } catch (err) {
          console.error('Download error:', err);
          throw err;
        }
      },
      {
        ...messages,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, []);

  useEffect(() => {
    return () => {
      chartRendererInst.current?.disposeChart();
      chartRendererInst.current?.removeEventListener('ready', renderChart);

      chartRendererInst.current?.removeEventListener(
        'chart-finished',
        chartRenderFinished
      );

      chartRendererInst.current?.removeEventListener(
        'chart-download',
        downloadChart
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chartRendererInst.current && chartDataConfig) {
      chartRendererInst.current = new ChartRenderer(CHART_CONTAINER_ID);

      chartRendererInst.current.addEventListener('ready', renderChart);

      chartRendererInst.current.addEventListener(
        'chart-finished',
        chartRenderFinished
      );

      chartRendererInst.current.addEventListener(
        'chart-download',
        downloadChart
      );
    }
  }, [chartDataConfig, chartRenderFinished, downloadChart, renderChart]);

  useEffect(() => {
    if (chartRendererInst.current && chartDataConfig) {
      chartRendererInst.current?.updateChart(chartDataConfig);
    }
  }, [chartDataConfig]);

  const generateImage = useCallback(
    (type: 'png' | 'jpeg', copy?: boolean, pdf?: boolean) => {
      if (!chartRendererInst.current) {
        throw new Error('Failed to generate image.');
      }
      chartRendererInst.current.downloadChart({
        uriType: type,
        backgroundColor: '#FFFFFF',
        copy,
        pdf,
      });
    },
    []
  );

  useEffect(() => {
    emitter.on(EVENTS.COPY_TO_CLIPBAORD, () => {
      generateImage('png', true);
    });
    emitter.on(EVENTS.EXPORT_TO_PNG, () => {
      generateImage('png');
    });
    emitter.on(EVENTS.EXPORT_TO_JPG, () => {
      generateImage('jpeg');
    });
    emitter.on(EVENTS.EXPORT_TO_PDF, () => {
      generateImage('png', false, true);
    });

    return () => {
      emitter.off(EVENTS.COPY_TO_CLIPBAORD, () => {
        generateImage('png', true);
      });
      emitter.off(EVENTS.EXPORT_TO_PNG, () => {
        generateImage('png');
      });
      emitter.off(EVENTS.EXPORT_TO_JPG, () => {
        generateImage('jpeg');
      });
      emitter.off(EVENTS.EXPORT_TO_PDF, () => {
        generateImage('png', false, true);
      });
    };
  }, [generateImage]);

  return (
    <div className="w-full h-[calc(100%_-_58px)] pt-3 relative">
      {!isChartRendered && (
        <div className="h-full w-full flex items-center justify-center z-10 bg-axis/50 absolute top-3 left-0 rounded-lg">
          <ChartNoAxesCombined
            className="size-10 stroke-border animate-pulse"
            aria-hidden={true}
          />
        </div>
      )}
      <div
        id={CHART_CONTAINER_ID}
        className="h-full bg-surface p-2.5 rounded-md overflow-hidden shadow-card box-border"
      ></div>
    </div>
  );
}

export default React.memo(ChartPreview);
