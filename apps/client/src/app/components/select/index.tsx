import { Field, Label, Select } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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
}

function CWSelect(props: ICWSelect) {
  const { id, label, options, defaultValue, onChange } = props;
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
          onChange={onChange}
          className="text-primary-text cursor-pointer w-full border border-primary-border py-2 pl-3 pr-8 rounded-lg truncate focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
        >
          {options?.map((item: ISelectOptions) => {
            return (
              <option
                key={item.id}
                value={item.value}
                defaultValue={defaultValue}
              >
                {item.label}
              </option>
            );
          })}
        </Select>
        <ChevronDownIcon
          className="group pointer-events-none absolute top-3 right-2.5 size-4 fill-primary-text"
          aria-hidden="true"
        />
      </div>
    </Field>
  );
}

export default CWSelect;
