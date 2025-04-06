import { Field, Input, Label } from '@headlessui/react';
import IconButton from '../iconButton';
import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';

interface ICWNumberInput {
  id: string;
  label?: string;
  defaultValue: number;
  onChange: (e: any) => void;
}

function CWNumberInput(props: ICWNumberInput) {
  const { id, label, defaultValue, onChange } = props;

  const isNumberASCII = (str: string) => {
    if (!str) return false; // Check for empty string
    for (let i = 0; i < str.length; i++) {
      const ascii = str.charCodeAt(i);
      if (ascii < 48 || ascii > 57) {
        // ASCII range for '0' to '9'
        return false;
      }
    }
    return true;
  };

  const validateNumberInputChange = (e: any) => {
    if (isNumberASCII(e.target.value)) {
      onChange(e);
    }
  };

  const increase = (e: any) => {
    e.target.value = defaultValue + 1;
    onChange(e);
  };

  const decrease = (e: any) => {
    e.target.value = defaultValue - 1;
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
      <div className="border border-primary-border rounded-lg flex items-center gap-1 pr-2">
        <Input
          id={id}
          value={defaultValue}
          onChange={validateNumberInputChange}
          className="text-primary-text w-10 py-2 pl-2 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none"
        />
        <IconButton
          icon={<Minus className="size-4" aria-hidden={true} />}
          onClick={decrease}
          tooltip="Decrease by one pixel."
        />
        <IconButton
          icon={<Plus className="size-4" aria-hidden={true} />}
          onClick={increase}
          tooltip="Increase by one pixel."
        />
      </div>
    </Field>
  );
}

export default CWNumberInput;
