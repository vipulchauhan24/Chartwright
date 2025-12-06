import React, { useCallback } from 'react';
import { useAtom } from 'jotai';
import { chartTemplates } from '../../../../store/charts';
import { API_ENDPOINTS } from '../../utils/constants';

interface IChartTemplates {
  onTemplateChange: (name: string) => void;
}

function ChartTemplates(props: IChartTemplates) {
  const { onTemplateChange } = props;
  const [charts] = useAtom(chartTemplates);

  const handleImgError = useCallback((event: any) => {
    event.target.src = '/chart-template-fallback.svg';
  }, []);

  return (
    <div className="mt-4 flex gap-2 justify-center flex-wrap max-h-[calc(100vh_-_80px)] overflow-auto relative">
      {charts.map((chart) => {
        return (
          <div
            className="w-[280px] border border-border rounded-md shadow-card cursor-pointer relative"
            role="button"
            onClick={() => {
              onTemplateChange(chart['name']);
            }}
          >
            <img
              className="w-full h-full object-cover rounded-md"
              src={`${API_ENDPOINTS.CHART_TEMPLATE}/thumbnail/${chart['thumbnail']}?v=${chart['versionNumber']}`}
              alt={chart['name']}
              onError={handleImgError}
              loading="lazy"
            />
            <div className="opacity-0 hover:opacity-100 absolute w-full h-full bg-black/50 top-0 left-0 flex items-center justify-center rounded-md">
              <h4 className="text-xl text-center font-semibold text-surface">
                {chart['name']}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(ChartTemplates);
