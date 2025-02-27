import { Field, Input, Label } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { useRef } from 'react';

interface ICWTextInput {
  id: string;
  label?: string;
  defaultValue: string;
  onChange: (e: any) => void;
  hint?: string;
  placeholder?: string;
}

function CWTextInput(props: ICWTextInput) {
  const { id, label, defaultValue, onChange, hint, placeholder } = props;
  const value = useRef(defaultValue);

  const update = (e: any) => {
    value.current = e.target.value;
    onChange(e);
  };

  return (
    <Field
      className={clsx('flex items-center justify-between', label && 'gap-2')}
    >
      <div className="flex items-center justify-between gap-1">
        {label && (
          <Label
            htmlFor={id}
            className="text-base font-normal text-primary-text select-none"
          >
            {label}
          </Label>
        )}
        {hint && (
          <Tippy content={hint}>
            <InformationCircleIcon className="w-5 h-5" />
          </Tippy>
        )}
      </div>
      <div className="relative w-full">
        <Input
          id={id}
          type="text"
          value={defaultValue}
          title={defaultValue ? '' : placeholder}
          placeholder={placeholder}
          onChange={update}
          className="text-primary-text border w-full border-primary-border py-2 px-3 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
        />
      </div>
    </Field>
  );
}

export default CWTextInput;
