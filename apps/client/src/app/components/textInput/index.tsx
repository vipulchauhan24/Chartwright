import { Field, Input, Label } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { Info } from 'lucide-react';
import { useRef } from 'react';

interface ICWTextInput {
  id: string;
  label?: string;
  defaultValue: string;
  onChange: (e: any) => void;
  hint?: string;
  placeholder?: string;
}

function CWTextInput(props: ICWTextInput) {
  const { id, label, defaultValue, onChange, hint, placeholder } = props;

  const update = (e: any) => {
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
            className="text-base font-normal text-text-main select-none"
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
      <div>
        <Input
          id={id}
          type="text"
          value={defaultValue}
          title={defaultValue ? '' : placeholder}
          placeholder={placeholder}
          onChange={update}
          className="text-text-main border w-full border-border py-2 px-3 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none"
        />
      </div>
    </Field>
  );
}

export default CWTextInput;
