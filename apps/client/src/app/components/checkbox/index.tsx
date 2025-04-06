import { Checkbox, Field, Label } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { Check, Info } from 'lucide-react';

interface ICWCheckbox {
  id: string;
  label: string;
  onChange: (e: any) => void;
  checked: boolean;
  hint?: string;
}

function CWCheckbox(props: ICWCheckbox) {
  const { id, label, onChange, checked, hint } = props;

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
            <Info className="size-4 opacity-80" aria-hidden={true} />
          </Tippy>
        )}
      </div>
      <Checkbox
        id={id}
        checked={checked}
        onChange={onChange}
        className="group cursor-pointer size-6 rounded-md p-1 ring-1 ring-primary-border data-[checked]:ring-primary-main ring-inset data-[checked]:bg-primary-main"
      >
        <Check
          className="hidden size-4 stroke-primary-background group-data-[checked]:block"
          aria-hidden={true}
        />
      </Checkbox>
    </Field>
  );
}

export default CWCheckbox;
