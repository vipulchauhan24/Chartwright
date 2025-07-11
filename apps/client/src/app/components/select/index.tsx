import { Field, Label, Select } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { ChevronDown, Info } from 'lucide-react';

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
  hint?: string;
}

function CWSelect(props: ICWSelect) {
  const { id, label, options, defaultValue, onChange, disabled, hint } = props;
  return (
    <Field className="flex items-center justify-between">
      <div className="flex items-center justify-between gap-1">
        {label && (
          <Label
            htmlFor={id}
            className="text-base font-normal text-text-main select-none"
          >
            {label}
          </Label>
        )}
        {hint && (
          <Tippy content={hint}>
            <Info className="size-4 opacity-80" aria-hidden={true} />
          </Tippy>
        )}
      </div>
      <div className="relative">
        <Select
          id={id}
          disabled={disabled}
          onChange={onChange}
          defaultValue={defaultValue}
          className={clsx(
            'text-text-main w-full border border-border py-2 pl-3 pr-8 rounded-lg truncate focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none',
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
          className="group pointer-events-none absolute top-3 right-2.5 size-4 fill-text-main"
          aria-hidden="true"
        />
      </div>
    </Field>
  );
}

export default CWSelect;
