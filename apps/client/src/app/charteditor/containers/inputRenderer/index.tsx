import React, { useCallback, useMemo } from 'react';
import CWCheckbox from '../../../components/checkbox';
import CWColorInput from '../../../components/colorInput';
import CWNumberInput from '../../../components/numberInput';
import CWSelect from '../../../components/select';
import CWTextArea from '../../../components/textArea';
import CWTextInput from '../../../components/textInput';

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
      id: 'textAlignment-auto',
      label: 'Auto',
      value: 'auto',
    },
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
      id: 'horizontalAlignment-auto',
      label: 'Auto',
      value: 'auto',
    },
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
      id: 'verticalAlignment-auto',
      label: 'Auto',
      value: 'auto',
    },
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
    {
      id: 'fontStyle-oblique',
      label: 'Oblique',
      value: 'oblique',
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
  } = props;

  const onChange = useCallback(
    (event: any) => {
      updateChartDataConfig(
        configPath,
        typeof event === 'object' ? event.target.value : event
      );
    },
    [configPath, updateChartDataConfig]
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
      return (
        <CWCheckbox {...inputProps} checked={Boolean(value)} hint={hint} />
      );
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
          options={REFERENCE_TABLE[`${reference}`]}
          disabled={disabled}
          hint={hint}
        />
      );
    case FIELD_TYPE.COLOR:
      return <CWColorInput {...inputProps} defaultValue={String(value)} />;
    case FIELD_TYPE.NUMBER:
      return (
        <CWNumberInput
          {...inputProps}
          defaultValue={parseInt(String(value), 10)}
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

export default InputRenderer;
