import { useAtom } from 'jotai';
import CWAccordian from '../../../components/accordian';
import { chartDataConfigStore } from '../../../../store/charts';
import CWChip from '../../../components/chip';
import CWTextInput from '../../../components/textInput';
import { Field, Input, Label } from '@headlessui/react';
import CWTextArea from '../../../components/textArea';

function ChartDataEditor() {
  const [chartDataConfig] = useAtom(chartDataConfigStore);

  return (
    <div className="mt-2 px-4">
      <CWAccordian
        id="chart-label-editor-acc"
        panelHeading="Edit Chart Labels"
        defaultOpen={true}
        panelComponent={
          <div className="flex flex-wrap gap-2">
            {chartDataConfig.options.xaxis.categories.map(
              (label: string, index: number) => {
                return <CWChip key={label + '-' + index} label={label} />;
              }
            )}
          </div>
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
