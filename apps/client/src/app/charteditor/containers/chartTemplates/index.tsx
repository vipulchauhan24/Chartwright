import { useAtom } from 'jotai';
import React from 'react';
import { chartGallery } from '../../../../store/charts';
import {
  CWGhostButton,
  CWOutlineButton,
  CWSpinner,
} from '@chartwright/ui-components';
import { API_ENDPOINTS } from '../../utils/constants';

interface IChartTemplates {
  toggleChartTemplateModal: (open: boolean) => void;
}

function ChartTemplates(props: IChartTemplates) {
  const { toggleChartTemplateModal } = props;
  const [charts] = useAtom(chartGallery);

  return (
    <div className="mt-4 grid gap-4 grid-cols-5 max-h-[calc(100vh_-_80px)] overflow-auto relative">
      {charts.map((chart) => {
        return (
          <div
            className="w-[280px] border border-border rounded-md shadow-card cursor-pointer relative"
            role="button"
            onClick={() => {
              toggleChartTemplateModal(false);
            }}
          >
            <img
              className="w-full h-full object-cover rounded-md"
              src={`${API_ENDPOINTS.CHART_IMAGE}/${chart['thumbnail']}`}
              alt={chart['title']}
              loading="lazy"
            />
            <div className="opacity-0 hover:opacity-100 absolute w-full h-full bg-black/50 top-0 left-0 flex items-center justify-center rounded-md">
              <h4 className="text-xl text-center font-semibold text-surface">
                {chart['title']}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChartTemplates;
