import CWCheckbox from '../../../components/checkbox';
import CWNumberInput from '../../../components/numberInput';
import CWSelect from '../../../components/select';
import CWTextInput from '../../../components/textInput';
import { DATA_SET_KEY, INPUT_TYPE, InputType } from '../../utils/enums';

export interface IInputRenderer {
  id: string;
  type: string;
  label: string;
  value: string | number | boolean | string[] | number[];
  onChange: (event: any, key?: DATA_SET_KEY, type?: InputType) => void;
  datasetKey?: DATA_SET_KEY;
  placeholder?: string;
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  index?: number;
  enabled?: boolean;
  subLabel?: string;
}

function InputRenderer(props: IInputRenderer) {
  const { id, type, label, value, onChange, datasetKey, options, enabled } =
    props;

  if (!enabled) return null;

  switch (type) {
    case INPUT_TYPE.CHECKBOX:
      return (
        <CWCheckbox
          id={id}
          label={label}
          checked={Boolean(value)}
          onChange={(e) => onChange(e, datasetKey, type)}
        />
      );
    case INPUT_TYPE.SELECT:
      return (
        <CWSelect
          id={id}
          label={label}
          defaultValue={String(value)}
          onChange={(e) => onChange(e, datasetKey, type)}
          options={options}
        />
      );
    case INPUT_TYPE.NUMBER:
      return (
        <CWNumberInput
          id={id}
          label={label}
          defaultValue={parseInt(String(value), 10)}
          onChange={(e) => onChange(e, datasetKey, type)}
        />
      );

    case INPUT_TYPE.TEXT:
      return (
        <CWTextInput
          id={id}
          label={label}
          defaultValue={String(value)}
          onChange={(e) => onChange(e, datasetKey, type)}
        />
      );

    default:
      return null;
  }
}

export default InputRenderer;
