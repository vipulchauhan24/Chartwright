import CWCheckbox from '../../../components/checkbox';
import CWColorInput from '../../../components/colorInput';
import CWNumberInput from '../../../components/numberInput';
import CWRangeInput from '../../../components/rangeInput';
import CWSelect from '../../../components/select';
import CWTableInput from '../../../components/tableInput';
import CWTextArea from '../../../components/textArea';
import CWTextInput from '../../../components/textInput';
import { DATA_SET_KEY, INPUT_TYPE } from '../../utils/enums';

export interface IInputRenderer {
  id: string;
  type: string;
  label: string;
  value: string | number | boolean | string[] | number[] | number[][];
  onChange: (
    event: any,
    key: DATA_SET_KEY
  ) => void | ((data: number[][]) => void);
  datasetKey: DATA_SET_KEY;
  placeholder?: string;
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  render: boolean;
  disabled?: boolean;
  hint?: string;
  min?: string;
  max?: string;
  step?: string;
}

function InputRenderer(props: IInputRenderer) {
  const {
    id,
    type,
    label,
    value,
    onChange,
    datasetKey,
    options,
    disabled,
    hint,
    placeholder,
    min,
    max,
    step,
    render,
  } = props;

  if (!render) return null;

  switch (type) {
    case INPUT_TYPE.CHECKBOX:
      return (
        <CWCheckbox
          id={id}
          label={label}
          checked={Boolean(value)}
          onChange={(e) => onChange(e, datasetKey)}
          hint={hint}
        />
      );
    case INPUT_TYPE.SELECT:
      return (
        <CWSelect
          id={id}
          label={label}
          defaultValue={String(value)}
          onChange={(e) => onChange(e, datasetKey)}
          options={options}
          disabled={disabled}
        />
      );
    case INPUT_TYPE.NUMBER:
      return (
        <CWNumberInput
          id={id}
          label={label}
          defaultValue={parseInt(String(value), 10)}
          onChange={(e) => onChange(e, datasetKey)}
        />
      );

    case INPUT_TYPE.TEXT:
      return (
        <CWTextInput
          id={id}
          label={label}
          defaultValue={String(value)}
          onChange={(e) => onChange(e, datasetKey)}
          hint={hint}
          placeholder={placeholder}
        />
      );
    case INPUT_TYPE.TEXT_AREA:
      return (
        <CWTextArea
          id={id}
          label={label}
          defaultValue={String(value)}
          onChange={(e) => onChange(e, datasetKey)}
        />
      );
    case INPUT_TYPE.COLOR:
      return (
        <CWColorInput
          id={id}
          label={label}
          defaultValue={String(value)}
          onChange={(e) => onChange(e, datasetKey)}
        />
      );
    case INPUT_TYPE.TABLE:
      return (
        <CWTableInput
          id={id}
          defaultValue={value as number[][]}
          onChange={(e) => onChange(e, datasetKey)}
        />
      );
    case INPUT_TYPE.RANGE:
      return (
        <CWRangeInput
          id={id}
          label={label}
          onChange={(e) => onChange(e, datasetKey)}
          min={String(min)}
          max={String(max)}
          step={String(step)}
          defaultValue={String(value)}
          disabled={disabled}
          hint={hint}
        />
      );
    default:
      return null;
  }
}

export default InputRenderer;
