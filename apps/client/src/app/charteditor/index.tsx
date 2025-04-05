import { useAtom } from 'jotai';
import AppShell from './layout/appshell';
import {
  fetchChartGallery,
  setDefaultChartConfig,
} from '../../service/chartsApi';
import { chartGallery, loadingChartConfig } from '../../store/charts';
import { useEffect, useState } from 'react';
import ChartRenderer from './containers/chartRenderer';
import GlobalOptionsEditor from './containers/globalOptionsEditor';
import CWLink from '../components/link';
import Spinner from '../components/spinner';
import ChartDataEditor from './containers/chartDataEditor';
import CWDropdown from '../components/dropdown';
import { simpleChartTypes } from './utils/constants';
import CWButton from '../components/button';
import ExportChart from './containers/export';
import ChartGallery from './containers/chartGallery';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { isExportDisabled } from '../../store/app';

function ChartEditor() {
  const [, fetchChartGalleryData] = useAtom(fetchChartGallery);
  const [exportDisabled] = useAtom(isExportDisabled);
  const [, getDefaultChartConfig] = useAtom(setDefaultChartConfig);
  const [chartGalleryData] = useAtom(chartGallery);
  const [isLoading] = useAtom(loadingChartConfig);
  const [showExportChartModal, setShowExportChartModal] = useState(false);
  const [showChartGallery, setShowChartGallery] = useState(false);
  const [chartSelectedIndx, setChartSelectedIndx] = useState(0);

  useEffect(() => {
    fetchChartGalleryData(); // Fetch data on mount
  }, [fetchChartGalleryData]);

  useEffect(() => {
    if (chartGalleryData.length && !isLoading) {
      getDefaultChartConfig('simple-bar-chart');
    }
  }, [chartGalleryData, getDefaultChartConfig, isLoading]);

  const onChangeChartRequest = (value: string) => {
    getDefaultChartConfig(value);
  };

  const exportChart = () => {
    setShowExportChartModal(true);
  };

  const openChartGallery = () => {
    setShowChartGallery(true);
  };

  const onSetChartViaGalleryOptions = (value: string) => {
    getDefaultChartConfig(value);
    for (const indx in simpleChartTypes) {
      if (simpleChartTypes[indx].value === value) {
        setChartSelectedIndx(Number(indx));
        break;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AppShell>
      <>
        <div className="flex items-start justify-between h-full">
          <aside className="w-1/5 min-w-80 h-full border-r border-primary-border flex flex-col items-center">
            <div className="w-full h-full overflow-y-auto">
              <GlobalOptionsEditor />
            </div>
            <div className="p-4">
              <CWLink href="#" label="Need Help?" />
            </div>
          </aside>
          <div className="h-full w-full px-4 pb-4 overflow-auto">
            <div className="flex items-center justify-end gap-2 pt-4 bg-white top-0 sticky z-50">
              <CWButton label="Open Chart Gallery" onClick={openChartGallery} />
              <CWButton
                disabled={exportDisabled}
                primary
                label={
                  <p className="flex items-center gap-1">
                    Export
                    <span>
                      <ArrowUpRightIcon className="size-4" />
                    </span>
                  </p>
                }
                onClick={exportChart}
              />
              <CWDropdown
                items={simpleChartTypes}
                onChange={onChangeChartRequest}
                selectedIndex={chartSelectedIndx}
              />
            </div>
            <ChartRenderer />
          </div>
          <aside className="w-1/5 min-w-80 h-full border-l border-primary-border overflow-y-auto">
            <ChartDataEditor />
          </aside>
        </div>
        <ExportChart
          isOpen={showExportChartModal}
          setIsOpen={setShowExportChartModal}
        />
        <ChartGallery
          isOpen={showChartGallery}
          setIsOpen={setShowChartGallery}
          onSetChartViaGalleryOptions={onSetChartViaGalleryOptions}
        />
      </>
    </AppShell>
  );
}

export default ChartEditor;
