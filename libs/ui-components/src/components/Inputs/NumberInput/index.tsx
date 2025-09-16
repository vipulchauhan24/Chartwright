import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { CWIconButton } from '../../Buttons/IconButton';
import { useCallback } from 'react';

interface ICWNumberInput {
  id: string;
  label?: string;
  defaultValue: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  min?: number;
  max?: number;
  step?: number;
}

export function CWNumberInput(props: ICWNumberInput) {
  const { id, label, defaultValue, onChange, min, max, step } = props;

  const isNumberASCII = useCallback((str: string) => {
    if (!str) return false; // Check for empty string
    for (let i = 0; i < str.length; i++) {
      const ascii = str.charCodeAt(i);
      if (ascii < 48 || ascii > 57) {
        // ASCII range for '0' to '9'
        return false;
      }
    }
    return true;
  }, []);

  const updateValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;
      if (max && Number(input.value) > max) {
        input.value = `${max}`;
      } else if (min && Number(input.value) < min) {
        input.value = `${min}`;
      }
      if (isNumberASCII(input.value)) {
        onChange(e);
      }
    },
    [max, isNumberASCII, onChange, min]
  );

  const increase = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (defaultValue === max) {
        return;
      }
      const input = e.target as HTMLInputElement;
      input.value = `${defaultValue + (step || 1)}`;
      onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [defaultValue, onChange, max, step]
  );

  const decrease = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (defaultValue === min) {
        return;
      }
      const input = e.target as HTMLInputElement;
      input.value = `${defaultValue - (step || 1)}`;
      onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [defaultValue, onChange, min, step]
  );

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
      <div className="border border-default rounded-md flex items-center gap-1 pr-2 w-full">
        <input
          id={id}
          type="number"
          value={defaultValue}
          onChange={updateValue}
          min={min}
          max={max}
          step={step}
          className="text-body w-full py-1 pl-2 rounded-md focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none"
        />
        <CWIconButton
          icon={<Minus className="size-4" aria-hidden={true} />}
          onClick={decrease}
          disabled={defaultValue === min}
        />
        <CWIconButton
          icon={<Plus className="size-4" aria-hidden={true} />}
          onClick={increase}
          disabled={defaultValue === max}
        />
      </div>
    </form>
  );
}
