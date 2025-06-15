import { useAtom } from 'jotai';
import { currentChartConfigStore } from '../../../../store/charts';
import ApexCharts from 'apexcharts';
import { useCallback, useEffect, useRef, useState } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import { Handler } from 'mitt';
import { base64ImageToBase64PDF, fileDownload } from '../../utils/lib';
import { isExportDisabled } from '../../../../store/app';
import { ChartNoAxesCombined } from 'lucide-react';

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

  const exportToImage = () => {
    apexRef.current.dataURI().then(({ imgURI }: { imgURI: unknown }) => {
      fileDownload(`${imgURI}`, 'chart');
    });
  };

  const exportToPDF: Handler<unknown> = useCallback(() => {
    apexRef.current.dataURI().then(({ imgURI }: { imgURI: unknown }) => {
      base64ImageToBase64PDF(`${imgURI}`)
        .then((pdfBase64) => {
          fileDownload(`${pdfBase64}`, 'chart');
        })
        .catch((err) => console.error(err));
    });
  }, []);

  useEffect(() => {
    emitter.on(EVENTS.EXPORT_TO_PDF, exportToPDF);
    emitter.on(EVENTS.EXPORT_TO_IMAGE, exportToImage);

    return () => {
      emitter.off(EVENTS.EXPORT_TO_PDF, exportToPDF);
      emitter.off(EVENTS.EXPORT_TO_IMAGE, exportToImage);
    };
  }, [exportToPDF]);

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
  }, [chartDataConfig, onChartMounted]);

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
