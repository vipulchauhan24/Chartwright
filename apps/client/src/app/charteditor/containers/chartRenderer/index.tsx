import { useAtom } from 'jotai';
import { chartDataConfigStore } from '../../../../store/charts';
import ApexCharts from 'apexcharts';
import { useCallback, useEffect, useRef } from 'react';
import emitter from '../../../../service/eventBus';
import { EVENTS } from '../../utils/events';
import { Handler } from 'mitt';
import {
  base64ImageToBase64PDF,
  changeBaseStringImageType,
} from '../../utils/lib';

function ChartRenderer() {
  const [chartDataConfig] = useAtom(chartDataConfigStore);
  const chartRef = useRef<any>(null);
  const apexRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const destroy = () => {
    if (apexRef.current) {
      apexRef.current.destroy();
    }
  };

  const generateSvg = () => {
    try {
      const svgElem = apexRef.current.el.getElementsByTagName('svg');
      svgElem[0].getElementsByTagName(
        'foreignObject'
      )[0].innerHTML += `<style type="text/css">
      .apexcharts-tooltip, .apexcharts-toolbar, .apexcharts-xaxistooltip,
      .apexcharts-yaxistooltip, .apexcharts-xcrosshairs, .apexcharts-ycrosshairs,
      .apexcharts-zoom-rect, .apexcharts-selection-rect {
      display: none;
      }
    </style>`;
      const div = document.createElement('div');
      div.appendChild(svgElem[0].cloneNode(true));
      const b64 = 'data:image/svg+xml;base64,' + window.btoa(div.innerHTML);
      emitter.emit(EVENTS.PREVIEW_IMAGE, {
        imgURI: b64,
      });
    } catch (error) {
      console.error('Conversion error:', error);
    }
  };

  const generatePng = () => {
    apexRef.current.dataURI().then((props: any) => {
      emitter.emit(EVENTS.PREVIEW_IMAGE, {
        imgURI: props.imgURI,
      });
    });
  };

  const generateJpg = () => {
    apexRef.current.dataURI().then((props: any) => {
      changeBaseStringImageType(props.imgURI, 'image/jpeg')
        .then((jpgBase64) => {
          emitter.emit(EVENTS.PREVIEW_IMAGE, {
            imgURI: jpgBase64,
          });
        })
        .catch((err) => console.error(err));
    });
  };

  const generateWebp = () => {
    apexRef.current.dataURI().then((props: any) => {
      changeBaseStringImageType(props.imgURI, 'image/webp')
        .then((webpBase64) => {
          emitter.emit(EVENTS.PREVIEW_IMAGE, {
            imgURI: webpBase64,
          });
        })
        .catch((err) => console.error(err));
    });
  };

  const onImageFileTypeUpdate: Handler<unknown> = useCallback((event: any) => {
    switch (event.type) {
      case 'svg':
        generateSvg();
        break;
      case 'png':
        generatePng();
        break;
      case 'jpeg':
        generateJpg();
        break;
      case 'webp':
        generateWebp();
        break;
      default:
        break;
    }
  }, []);

  const generatePdf = () => {
    apexRef.current.dataURI().then((props: any) => {
      base64ImageToBase64PDF(props.imgURI)
        .then((pdfBase64) => {
          emitter.emit(EVENTS.PREVIEW_IMAGE, {
            imgURI: pdfBase64,
          });
        })
        .catch((err) => console.error(err));
    });
  };

  const onPdfFileTypeUpdate: Handler<unknown> = useCallback(() => {
    generatePdf();
  }, []);

  useEffect(() => {
    emitter.on(EVENTS.ON_IMAGE_FILE_TYPE_UPDATE, onImageFileTypeUpdate);
    emitter.on(EVENTS.ON_PDF_FILE_TYPE_UPDATE, onPdfFileTypeUpdate);

    return () => {
      emitter.off(EVENTS.ON_IMAGE_FILE_TYPE_UPDATE, onImageFileTypeUpdate);
      emitter.off(EVENTS.ON_PDF_FILE_TYPE_UPDATE, onPdfFileTypeUpdate);
    };
  }, [onImageFileTypeUpdate, onPdfFileTypeUpdate]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (chartDataConfig && chartRef.current) {
      timeoutRef.current = setTimeout(() => {
        destroy();
        const chart = new ApexCharts(chartRef.current, chartDataConfig.options);
        chart.render();
        apexRef.current = chart;
      }, 250);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [chartDataConfig]);

  return (
    <div className="w-full h-[calc(100%_-_1.625rem)] overflow-y-auto">
      <div className="w-full p-3 flex items-center justify-center">
        <div ref={chartRef} className="w-11/12"></div>
      </div>
    </div>
  );
}

export default ChartRenderer;
