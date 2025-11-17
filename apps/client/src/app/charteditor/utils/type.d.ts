type FieldType = 'switch' | 'text' | 'lookup' | 'color';
type DataType = 'boolean' | 'string';

interface BaseUserInput<T extends DataType = DataType> {
  label: string;
  fieldType: FieldType;
  dataType: T;
  configPath: string;
  default?: T extends 'boolean' ? boolean : string;
  hint?: string;
}

interface LookupUserInput extends BaseUserInput<'string'> {
  fieldType: 'lookup';
  reference: string;
}

type UserInput =
  | BaseUserInput<'boolean'>
  | BaseUserInput<'string'>
  | LookupUserInput;

interface Options {
  title: string;
  userInputs: UserInput[];
}

export interface ConfigSchema {
  globalOptions: Options[];
  chartEditOptions: Options[];
  chartEditSeries: Options[];
}
