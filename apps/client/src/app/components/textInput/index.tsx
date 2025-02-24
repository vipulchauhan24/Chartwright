import { Field, Input, Label } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';

interface ICWTextInput {
  id: string;
  label: string;
  defaultValue: string;
  onChange: (e: any) => void;
  hint?: string;
  placeholder?: string;
}

function CWTextInput(props: ICWTextInput) {
  const { id, label, defaultValue, onChange, hint, placeholder } = props;

  return (
    <Field className="flex items-center justify-between gap-2">
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
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          className="text-primary-text border border-primary-border py-2 pl-3 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
        />
      </div>
    </Field>
  );
}

export default CWTextInput;
