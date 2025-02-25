import { Field, Input, Label } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ICWColorInput {
  id: string;
  label: string;
  defaultValue: string;
  onChange: (e: any) => void;
  hint?: string;
}

function CWColorInput(props: ICWColorInput) {
  const { id, label, defaultValue, onChange, hint } = props;

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-between gap-1">
          <Label
            htmlFor={id}
            className="text-base font-normal text-primary-text select-none"
          >
            {label}
          </Label>
          {hint && (
            <Tippy content={hint}>
              <InformationCircleIcon className="w-5 h-5" />
            </Tippy>
          )}
        </div>
        <Input
          id={id}
          type="color"
          value={defaultValue}
          onChange={onChange}
          className="text-primary-text border border-primary-border px-2 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
        />
      </div>
    </Field>
  );
}

export default CWColorInput;
