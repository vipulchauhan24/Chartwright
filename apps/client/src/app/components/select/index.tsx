import { Field, Label, Select } from '@headlessui/react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface ISelectOptions {
  id: string;
  label: string;
  value: string;
}

interface ICWSelect {
  id: string;
  label: string;
  defaultValue: string;
  onChange: (e: any) => void;
  options?: Array<ISelectOptions>;
  disabled?: boolean;
}

function CWSelect(props: ICWSelect) {
  const { id, label, options, defaultValue, onChange, disabled } = props;
  return (
    <Field className="flex items-center justify-between">
      <Label
        htmlFor={id}
        className="text-base font-normal text-primary-text select-none"
      >
        {label}
      </Label>
      <div className="relative">
        <Select
          id={id}
          disabled={disabled}
          onChange={onChange}
          defaultValue={defaultValue}
          className={clsx(
            'text-primary-text w-full border border-primary-border py-2 pl-3 pr-8 rounded-lg truncate focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none',
            disabled && 'pointer-events-none opacity-50'
          )}
        >
          {options?.map((item: ISelectOptions) => {
            return (
              <option key={item.id} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </Select>
        <ChevronDown
          className="group pointer-events-none absolute top-3 right-2.5 size-4 fill-primary-text"
          aria-hidden="true"
        />
      </div>
    </Field>
  );
}

export default CWSelect;
