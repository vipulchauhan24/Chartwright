import { Field, Label } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { useRef } from 'react';

interface ICWRangeInput {
  id: string;
  label: string;
  onChange: (value: string) => void;
  min: string;
  max: string;
  step: string;
  defaultValue: string;
  disabled?: boolean;
  hint?: string;
}

function CWRangeInput(props: ICWRangeInput) {
  const { id, label, min, max, step, defaultValue, onChange, disabled, hint } =
    props;
  const value = useRef(parseInt(defaultValue));
  const range = useRef(null);

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
      <div
        className={clsx(
          'relative range-container',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <input
          ref={range}
          className="rounded-lg overflow-hidden appearance-none bg-primary-background border border-primary-border h-3 w-128"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.current}
          onChange={update}
          disabled={disabled}
        />
        <output
          style={{
            left: `calc(${(Number(value.current) / 100) * 100}% - 24px)`,
          }}
          className="bg-primary-background border-2 border-primary-main rounded-full absolute -top-6 px-1"
          htmlFor={id}
        >
          {value.current}%
        </output>
      </div>
    </Field>
  );
}

export default CWRangeInput;
