import React, { useEffect, useState } from 'react';
import CWTextArea from '../../../components/textArea';
import CWButton from '../../../components/button';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import CWAccordian from '../../../components/accordian';
import { useAtom } from 'jotai';
import { chartDataConfigStore } from '../../../../store/charts';
import CWChip from '../../../components/chip';

function ChartLabelEditor() {
  const [chartDataConfig, setChartDataConfig] = useAtom(chartDataConfigStore);
  const [labelsEditable, setLabelsEditable] = useState<boolean>(false);
  const [chartLabelsData, setChartLabelData] = useState<Array<string>>(
    chartDataConfig.options.labels
  );

  useEffect(() => {
    setChartLabelData(chartDataConfig.options.labels);
  }, [chartDataConfig.options.labels]);

  const deleteLabel = (index: number) => {
    const config = JSON.parse(JSON.stringify(chartDataConfig));
    config.options.labels.splice(index, 1);
    setChartDataConfig(config);
  };

  const toggleLabelsEditable = (event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    setLabelsEditable((prev) => !prev);
  };

  const onLabelsEdit = (e: any) => {
    let labels = e.target.value;
    labels = labels.split(',');
    setChartLabelData(labels);
  };

  const onLabelsEditCancel = () => {
    toggleLabelsEditable();
  };

  const onLabelsEditSave = () => {
    const config = JSON.parse(JSON.stringify(chartDataConfig));
    const filteredChartLabelsData = chartLabelsData.filter(
      (label) => label !== ''
    );
    config.options.labels = filteredChartLabelsData;
    setChartDataConfig(config);
    toggleLabelsEditable();
  };
  return (
    <CWAccordian
      id="chart-label-editor-acc"
      panelHeading="Chart Labels"
      defaultOpen={true}
      panelHeadingButton={
        !labelsEditable ? (
          <Tippy content="Click to add / edit / remove chart labels.">
            <span
              onClick={toggleLabelsEditable}
              role="button"
              className="cursor-pointer bg-primary-background p-1 hover:bg-primary-main hover:text-primary-background rounded-sm"
            >
              <PencilSquareIcon className="size-4" aria-hidden={true} />
            </span>
          </Tippy>
        ) : null
      }
      panelComponent={
        !labelsEditable ? (
          <div className="flex flex-wrap gap-2">
            {chartDataConfig.options.labels.map(
              (label: string, index: number) => {
                return (
                  <CWChip
                    key={label + '-' + index}
                    label={label}
                    onDelete={() => {
                      deleteLabel(index);
                    }}
                  />
                );
              }
            )}
          </div>
        ) : (
          <div>
            <CWTextArea
              defaultValue={chartLabelsData.join(',')}
              id="chart-label-editor-acc-text-area"
              onChange={onLabelsEdit}
            />
            <CWButton
              label="Cancel"
              onClick={onLabelsEditCancel}
              additionalCssClasses="mt-2"
            />
            <CWButton
              label="Save"
              onClick={onLabelsEditSave}
              additionalCssClasses="mt-2 ml-2"
            />
          </div>
        )
      }
    />
  );
}

export default ChartLabelEditor;
