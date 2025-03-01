import { Field, Label } from '@headlessui/react';
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
}

function CWRangeInput(props: ICWRangeInput) {
  const { id, label, min, max, step, defaultValue, onChange } = props;
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
      {label && (
        <Label
          htmlFor={id}
          className="text-base font-normal text-primary-text select-none"
        >
          {label}
        </Label>
      )}
      <div className="relative range-container">
        <input
          ref={range}
          className="rounded-lg overflow-hidden appearance-none bg-primary-background border border-primary-border h-3 w-128"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.current}
          onChange={update}
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
