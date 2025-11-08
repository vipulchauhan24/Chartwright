import React, { useCallback, useMemo } from 'react';
import { isArray } from '../../utils/lib';
import {
  CWSwitch,
  CWTextInput,
  CWSelect,
  CWColorInput,
  CWNumberInput,
  CWTextArea,
} from '@chartwright/ui-components';

interface IInputRenderer {
  id: string;
  label: string;
  fieldType: string;
  dataType: string;
  value: string | string[] | boolean | number | number[];
  configPath: string;
  updateChartDataConfig: (
    path: string,
    value: string | string[] | boolean | number | number[]
  ) => void;
  hint?: string;
  reference?: string;
  disabled?: boolean;
  configPathPrefix?: string;
  min?: number;
  max?: number;
  step?: number;
}

const REFERENCE_TABLE: any = {
  externalLinkTarget: [
    {
      id: 'externalLinkTarget-blank',
      label: 'Blank',
      value: 'blank',
    },
    {
      id: 'externalLinkTarget-self',
      label: 'Self',
      value: 'self',
    },
  ],
  textAlignment: [
    {
      id: 'textAlignment-left',
      label: 'Left',
      value: 'left',
    },
    {
      id: 'textAlignment-right',
      label: 'Right',
      value: 'right',
    },
    {
      id: 'textAlignment-center',
      label: 'Center',
      value: 'center',
    },
  ],
  horizontalAlignment: [
    {
      id: 'horizontalAlignment-left',
      label: 'Left',
      value: 'left',
    },
    {
      id: 'horizontalAlignment-center',
      label: 'Center',
      value: 'center',
    },
    {
      id: 'horizontalAlignment-right',
      label: 'Right',
      value: 'right',
    },
  ],
  verticalAlignment: [
    {
      id: 'verticalAlignment-top',
      label: 'Top',
      value: 'top',
    },
    {
      id: 'verticalAlignment-middle',
      label: 'Middle',
      value: 'middle',
    },
    {
      id: 'verticalAlignment-bottom',
      label: 'Bottom',
      value: 'bottom',
    },
  ],
  fontWeight: [
    {
      id: 'fontWeight-lighter',
      label: 'Lighter',
      value: 'lighter',
    },
    {
      id: 'fontWeight-normal',
      label: 'Normal',
      value: 'normal',
    },
    {
      id: 'fontWeight-bold',
      label: 'Bold',
      value: 'bold',
    },
    {
      id: 'fontWeight-bolder',
      label: 'Bolder',
      value: 'bolder',
    },
  ],
  fontFamily: [
    {
      id: 'fontFamily-Courier-New',
      label: 'Courier New',
      value: 'Courier New',
    },
    {
      id: 'fontFamily-Georgia',
      label: 'Georgia',
      value: 'Georgia',
    },
    {
      id: 'fontFamily-Helvetica',
      label: 'Helvetica',
      value: 'Helvetica',
    },
    {
      id: 'fontFamily-Open-Sans',
      label: 'Open Sans',
      value: 'Open Sans',
    },
    {
      id: 'fontFamily-Roboto',
      label: 'Roboto',
      value: 'Roboto',
    },
    {
      id: 'fontFamily-Times-New-Roman',
      label: 'Times New Roman',
      value: 'Times New Roman',
    },
  ],
  fontStyle: [
    {
      id: 'fontStyle-normal',
      label: 'Normal',
      value: 'normal',
    },
    {
      id: 'fontStyle-italic',
      label: 'Italic',
      value: 'italic',
    },
  ],
  legendType: [
    {
      id: 'legendType-plain',
      label: 'Plain',
      value: 'plain',
    },
    {
      id: 'legendType-scroll',
      label: 'Scroll',
      value: 'scroll',
    },
  ],
  legendOrient: [
    {
      id: 'legendOrient-horizontal',
      label: 'Horizontal',
      value: 'horizontal',
    },
    {
      id: 'legendOrient-vertical',
      label: 'Vertical',
      value: 'vertical',
    },
  ],
  legendIcons: [
    {
      id: 'legendIcons-circle',
      label: 'Circle',
      value: 'circle',
    },
    {
      id: 'legendIcons-rect',
      label: 'Rect',
      value: 'rect',
    },
    {
      id: 'legendIcons-roundRect',
      label: 'Round Rect',
      value: 'roundRect',
    },
    {
      id: 'legendIcons-triangle',
      label: 'Triangle',
      value: 'triangle',
    },
    {
      id: 'legendIcons-diamond',
      label: 'Diamond',
      value: 'diamond',
    },
    {
      id: 'legendIcons-pin',
      label: 'Pin',
      value: 'pin',
    },
    {
      id: 'legendIcons-arrow',
      label: 'Arrow',
      value: 'arrow',
    },
    {
      id: 'legendIcons-none',
      label: 'none',
      value: 'none',
    },
  ],
  xAxisPosition: [
    {
      id: 'xAxisPosition-top',
      label: 'Top',
      value: 'top',
    },
    {
      id: 'xAxisPosition-bottom',
      label: 'Bottom',
      value: 'bottom',
    },
  ],
  labelVerticalAlignment: [
    {
      id: 'labelVerticalAlignment-top',
      label: 'Top',
      value: 'top',
    },
    {
      id: 'labelVerticalAlignment-middle',
      label: 'Middle',
      value: 'middle',
    },
    {
      id: 'labelVerticalAlignment-bottom',
      label: 'Bottom',
      value: 'bottom',
    },
  ],
  labelPosition: [
    {
      id: 'labelPosition-inside',
      label: 'Inside',
      value: 'inside',
    },
    {
      id: 'labelPosition-left',
      label: 'Left',
      value: 'left',
    },
    {
      id: 'labelPosition-right',
      label: 'Right',
      value: 'right',
    },
    {
      id: 'labelPosition-bottom',
      label: 'Bottom',
      value: 'bottom',
    },
  ],
  lineLabelPosition: [
    {
      id: 'labelPosition-top',
      label: 'Top',
      value: 'top',
    },
    {
      id: 'labelPosition-left',
      label: 'Left',
      value: 'left',
    },
    {
      id: 'labelPosition-right',
      label: 'Right',
      value: 'right',
    },
    {
      id: 'labelPosition-bottom',
      label: 'Bottom',
      value: 'bottom',
    },
  ],
  lineItemSymbol: [
    {
      id: 'lineItemSymbol-emptyCircle',
      label: 'Empty Circle',
      value: 'emptyCircle',
    },
    {
      id: 'lineItemSymbol-circle',
      label: 'Circle',
      value: 'circle',
    },
    {
      id: 'lineItemSymbol-rect',
      label: 'Rect',
      value: 'rect',
    },
    {
      id: 'lineItemSymbol-roundRect',
      label: 'Round Rect',
      value: 'roundRect',
    },
    {
      id: 'lineItemSymbol-triangle',
      label: 'Triangle',
      value: 'triangle',
    },
    {
      id: 'lineItemSymbol-diamond',
      label: 'Diamond',
      value: 'diamond',
    },
    {
      id: 'lineItemSymbol-pin',
      label: 'Pin',
      value: 'pin',
    },
    {
      id: 'lineItemSymbol-arrow',
      label: 'Arrow',
      value: 'arrow',
    },
    {
      id: 'lineItemSymbol-none',
      label: 'none',
      value: 'none',
    },
  ],
  areaOrigin: [
    {
      id: 'areaOrigin-top',
      label: 'Start',
      value: 'start',
    },
    {
      id: 'areaOrigin-middle',
      label: 'End',
      value: 'end',
    },
    {
      id: 'areaOrigin-bottom',
      label: 'Auto',
      value: 'auto',
    },
  ],
  lineType: [
    {
      id: 'lineType-solid',
      label: 'Solid',
      value: 'solid',
    },
    {
      id: 'lineType-dashed',
      label: 'Dashed',
      value: 'dashed',
    },
    {
      id: 'lineType-dotted',
      label: 'Dotted',
      value: 'dotted',
    },
  ],
};

enum FIELD_TYPE {
  SWITCH = 'switch',
  TEXT = 'text',
  LOOK_UP = 'lookup',
  COLOR = 'color',
  NUMBER = 'number',
  TEXT_AREA = 'textArea',
}

function InputRenderer(props: IInputRenderer) {
  const {
    id,
    label,
    fieldType,
    value,
    hint,
    reference,
    disabled,
    configPath,
    updateChartDataConfig,
    configPathPrefix,
    min,
    max,
    step,
  } = props;

  const onChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement> | string | string[] | boolean
    ) => {
      updateChartDataConfig(
        configPathPrefix ? configPathPrefix + configPath : configPath,
        typeof event === 'object' && !isArray(event)
          ? event.target.value
          : event
      );
    },
    [configPathPrefix, configPath, updateChartDataConfig]
  );

  const inputProps = useMemo(() => {
    return {
      id,
      label,
      onChange,
    };
  }, [id, label, onChange]);

  switch (fieldType) {
    case FIELD_TYPE.SWITCH:
      return <CWSwitch {...inputProps} checked={Boolean(value)} hint={hint} />;
    case FIELD_TYPE.TEXT:
      return (
        <CWTextInput
          {...inputProps}
          defaultValue={String(value)}
          hint={hint}
          placeholder="Type here..."
        />
      );
    case FIELD_TYPE.LOOK_UP:
      return (
        <CWSelect
          {...inputProps}
          defaultValue={String(value)}
          items={REFERENCE_TABLE[`${reference}`]}
          disabled={disabled}
          hint={hint}
          placeholder="Choose.."
        />
      );
    case FIELD_TYPE.COLOR:
      return <CWColorInput {...inputProps} defaultValue={String(value)} />;
    case FIELD_TYPE.NUMBER:
      return (
        <CWNumberInput
          {...inputProps}
          defaultValue={Number(Number(value).toFixed(1))}
          min={min}
          max={max}
          step={step}
        />
      );
    case FIELD_TYPE.TEXT_AREA:
      return (
        <CWTextArea
          {...inputProps}
          defaultValue={(value as string[]).join(', ')}
        />
      );
    default:
      return null;
  }
}

export default React.memo(InputRenderer);
