import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import React, { useCallback, useRef } from 'react';

interface ICWColorInput {
  id: string;
  label: string;
  defaultValue: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export function CWColorInput(props: ICWColorInput) {
  const { id, label, defaultValue, onChange } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const open = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      el.showPicker(); // opens native picker where supported
    } else {
      el.click(); // fallback for older browsers
    }
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
      <div className="flex items-center">
        <Tippy content={defaultValue}>
          <div
            style={{
              backgroundColor: defaultValue,
              boxShadow: 'inset 0 0 0 1px #0000001a',
            }}
            className="size-8 rounded-md cursor-pointer"
            onClick={open}
          ></div>
        </Tippy>
        <input
          ref={inputRef}
          id={id}
          type="color"
          value={defaultValue}
          onChange={onChange}
          className="border-none p-0 rounded-md focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none cursor-pointer opacity-0 w-0 h-0"
        />
      </div>
    </form>
  );
}
