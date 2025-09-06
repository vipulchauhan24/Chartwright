import React, { useRef } from 'react';
import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import { Info } from 'lucide-react';

interface ICWTextArea {
  id: string;
  label?: string;
  defaultValue: string;
  onChange: (value: string[]) => void;
  hint?: string;
}

export function CWTextArea(props: ICWTextArea) {
  const { id, label, defaultValue, onChange, hint } = props;
  const value = useRef(defaultValue);

  const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    value.current = e.target.value;
    onChange(value.current.split(','));
  };

  return (
    <form
      className={clsx('flex items-center justify-between', label && 'gap-2')}
    >
      {label && (
        <div className="min-w-[40%] max-w-[40%]">
          <label
            htmlFor={id}
            className="text-base font-normal text-text-main select-none"
          >
            {label}
          </label>
        </div>
      )}

      <div className="flex items-center justify-start w-full">
        <textarea
          id={id}
          value={value.current}
          onChange={update}
          className="text-text-main border w-full border-border py-1 pl-3 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none"
          rows={3}
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
