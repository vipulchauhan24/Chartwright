import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import { Info } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ICWTextInput {
  id: string;
  label?: string;
  defaultValue: string;
  onChange: (input: string) => void;
  hint?: string;
  placeholder?: string;
}

export function CWTextInput(props: ICWTextInput) {
  const { id, label, defaultValue, onChange, hint, placeholder } = props;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState(
    defaultValue === 'undefined' ? '' : defaultValue
  );

  const onInputChange = () => {
    if (!inputRef.current) return;
    const value = inputRef.current?.value || '';
    setInputValue(value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.log(value);
      onChange?.(value);
      timeoutRef.current = null;
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={onInputChange}
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
