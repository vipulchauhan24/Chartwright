import { useAtom } from 'jotai';
import { currentChartConfigStore } from '../../../../store/charts';
import ApexCharts from 'apexcharts';
import { useCallback, useEffect, useRef, useState } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import { Handler } from 'mitt';
import {
  base64ImageToBase64PDF,
  copyToMemory,
  fileDownload,
} from '../../utils/lib';
import { isExportDisabled } from '../../../../store/app';
import { ChartNoAxesCombined } from 'lucide-react';
import toast from 'react-hot-toast';

const EXPORT_ERROR_MSG = 'Oops, try again later.';

function ChartRenderer() {
  const [chartDataConfig] = useAtom(currentChartConfigStore);
  const [, setIsExportChartDisabled] = useAtom(isExportDisabled);

  const chartRef = useRef<any>(null);
  const apexRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  const [isChartRendered, setIsChartRendered] = useState<boolean>(false);

  const destroy = () => {
    if (apexRef.current) {
      apexRef.current.destroy();
    }
  };

  const generateImage = async (): Promise<string> => {
    const { imgURI }: { imgURI: unknown } = await apexRef.current.dataURI();

    return `${imgURI}`;
  };

  const generateSVG = async (): Promise<string> => {
    const svgString = await apexRef.current.getSvgString();
    return `${svgString}`;
  };

  const exportToImage = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const imgURI = await generateImage();
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
  }, []);

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

  const exportToPDF: Handler<unknown> = useCallback(() => {
    toast.promise(
      async () => {
        try {
          const imgURI = await generateImage();
          const pdfBase64 = await base64ImageToBase64PDF(`${imgURI}`);
          fileDownload(`${pdfBase64}`, 'chart');
        } catch (err) {
          console.error('Failed to download pdf:', err);
          throw err;
        }
      },
      {
        loading: 'Downloading...',
        success: <b>PDF downloaded successfully!</b>,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, []);

  const exportToSVG = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const svgString = await generateSVG();
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'chart.svg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Free up memory
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error('Failed to download SVG:', err);
          throw err;
        }
      },
      {
        loading: 'Downloading...',
        success: <b>SVG downloaded successfully!</b>,
        error: <b>{EXPORT_ERROR_MSG}</b>,
      }
    );
  }, []);

  useEffect(() => {
    emitter.on(EVENTS.EXPORT_TO_PDF, exportToPDF);
    emitter.on(EVENTS.COPY_TO_CLIPBAORD, copyToClipboard);
    emitter.on(EVENTS.EXPORT_TO_IMAGE, exportToImage);
    emitter.on(EVENTS.EXPORT_TO_SVG, exportToSVG);

    return () => {
      emitter.off(EVENTS.EXPORT_TO_PDF, exportToPDF);
      emitter.off(EVENTS.COPY_TO_CLIPBAORD, copyToClipboard);
      emitter.off(EVENTS.EXPORT_TO_IMAGE, exportToImage);
      emitter.off(EVENTS.EXPORT_TO_SVG, exportToSVG);
    };
  }, [copyToClipboard, exportToImage, exportToPDF, exportToSVG]);

  const onChartMounted = useCallback(() => {
    setIsChartRendered(true);
  }, []);

  const onChartAnimationEnded = useCallback(() => {
    setIsExportChartDisabled(false);
  }, [setIsExportChartDisabled]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (chartDataConfig && chartRef.current) {
      setIsExportChartDisabled(true);
      timeoutRef.current = setTimeout(() => {
        destroy();
        chartDataConfig.options.chart['events'] = {
          mounted: onChartMounted,
          animationEnd: onChartAnimationEnded,
        };
        const chart = new ApexCharts(chartRef.current, chartDataConfig.options);
        chart.render();
        apexRef.current = chart;
      }, 250);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [
    chartDataConfig,
    onChartAnimationEnded,
    onChartMounted,
    setIsExportChartDisabled,
  ]);

  return (
    <div className="w-full h-[calc(100%_-_58px)] p-3 relative">
      {!isChartRendered && (
        <div className="h-full w-full flex items-center justify-center animate-pulse bg-background rounded-xl">
          <ChartNoAxesCombined
            className="size-10 stroke-border"
            aria-hidden={true}
          />
        </div>
      )}
      <div ref={chartRef} className="w-full"></div>
    </div>
  );
}

export default ChartRenderer;
