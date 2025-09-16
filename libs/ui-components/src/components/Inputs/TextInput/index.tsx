import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import { Info } from 'lucide-react';
import React from 'react';

interface ICWTextInput {
  id: string;
  label?: string;
  defaultValue: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  hint?: string;
  placeholder?: string;
}

export function CWTextInput(props: ICWTextInput) {
  const { id, label, defaultValue, onChange, hint, placeholder } = props;

  return (
    <form
      className={clsx('flex items-center justify-between', label && 'gap-2')}
    >
      {label && (
        <div className="min-w-[40%] max-w-[40%]">
          <label
            htmlFor={id}
            className="text-base font-normal text-body select-none"
          >
            {label}
          </label>
        </div>
      )}
      <div className="flex items-center justify-start w-full">
        <input
          id={id}
          type="text"
          value={defaultValue === 'undefined' ? '' : defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          className="text-body border w-full border-default py-1 px-2 rounded-md focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none"
        />
        {hint && (
          <Tippy content={hint}>
            <Info
              className="min-w-4 min-h-4 size-4 opacity-80 ml-2"
              aria-hidden={true}
            />
          </Tippy>
        )}
      </div>
    </form>
  );
}
