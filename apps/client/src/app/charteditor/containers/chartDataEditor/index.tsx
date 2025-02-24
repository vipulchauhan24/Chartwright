import { useAtom } from 'jotai';
import CWAccordian from '../../../components/accordian';
import { chartDataConfigStore } from '../../../../store/charts';
import CWChip from '../../../components/chip';
import CWTextInput from '../../../components/textInput';
import { Field, Input, Label } from '@headlessui/react';
import CWTextArea from '../../../components/textArea';
import { useEffect, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import CWButton from '../../../components/button';
import Tippy from '@tippyjs/react';

function ChartDataEditor() {
  const [chartDataConfig, setChartDataConfig] = useAtom(chartDataConfigStore);
  const [labelsEditable, setLabelsEditable] = useState<boolean>(false);
  const [chartLabelsData, setChartLabelData] = useState<Array<string>>(
    chartDataConfig.options.xaxis.categories
  );

  useEffect(() => {
    setChartLabelData(chartDataConfig.options.xaxis.categories);
  }, [chartDataConfig.options.xaxis.categories]);

  const deleteLabel = (index: number) => {
    const config = JSON.parse(JSON.stringify(chartDataConfig));
    config.options.xaxis.categories.splice(index, 1);
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
    config.options.xaxis.categories = filteredChartLabelsData;
    setChartDataConfig(config);
    toggleLabelsEditable();
  };

  return (
    <div className="mt-2 px-4">
      <CWAccordian
        id="chart-label-editor-acc"
        panelHeading="Edit Chart Labels"
        defaultOpen={true}
        panelHeadingButton={
          !labelsEditable ? (
            <Tippy content="Click add / edit / remove chart labels.">
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
              {chartDataConfig.options.xaxis.categories.map(
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
      <div className="mt-2">
        <CWAccordian
          id="chart-data-editor-acc"
          panelHeading={'Edit ' + chartDataConfig.series[0].name}
          panelComponent={
            <div>
              <CWTextInput
                id="edit-chart-data-series-name-0"
                label="Name"
                defaultValue={chartDataConfig.series[0].name}
                onChange={() => {
                  console.log('jer');
                }}
              />
              <div className="mt-2">
                <CWTextArea
                  id="edit-chart-data"
                  defaultValue={chartDataConfig.series[0].data}
                  label="Data"
                  onChange={() => {
                    console.log('jer');
                  }}
                />
              </div>
              <Field className="flex items-center justify-between gap-2 mt-2">
                <Label className="text-base font-normal text-primary-text select-none">
                  Color
                </Label>
                <Input
                  id={'color'}
                  type="color"
                  value={chartDataConfig.options.colors[0]}
                  onChange={() => {
                    console.log('jer');
                  }}
                  className="text-primary-text border border-primary-border px-2 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
                />
              </Field>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default ChartDataEditor;
