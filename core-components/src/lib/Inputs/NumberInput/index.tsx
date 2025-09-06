import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { CWIconButton } from '../../Buttons/IconButton';
import { useCallback } from 'react';

interface ICWNumberInput {
  id: string;
  label?: string;
  defaultValue: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export function CWNumberInput(props: ICWNumberInput) {
  const { id, label, defaultValue, onChange } = props;

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
      if (isNumberASCII(input.value)) {
        onChange(e);
      }
    },
    [onChange, isNumberASCII]
  );

  const increase = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const input = e.target as HTMLInputElement;
      input.value = `${defaultValue + 1}`;
      onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [defaultValue, onChange]
  );

  const decrease = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const input = e.target as HTMLInputElement;
      input.value = `${defaultValue - 1}`;
      onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [defaultValue, onChange]
  );

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
      <div className="border border-border rounded-lg flex items-center gap-1 pr-2 w-full">
        <input
          id={id}
          type="number"
          value={defaultValue}
          onChange={updateValue}
          className="text-text-main w-full py-1 pl-2 rounded-md focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none"
        />
        <CWIconButton
          icon={<Minus className="size-4" aria-hidden={true} />}
          onClick={decrease}
          tooltip="Decrease by 1"
        />
        <CWIconButton
          icon={<Plus className="size-4" aria-hidden={true} />}
          onClick={increase}
          tooltip="Increase by 1"
        />
      </div>
    </form>
  );
}
