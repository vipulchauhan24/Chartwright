import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { Info } from 'lucide-react';
import { Switch } from 'radix-ui';

interface ICWSwitch {
  id: string;
  label?: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
  hint?: string;
}

export function CWSwitch(props: ICWSwitch) {
  const { id, label, onChange, checked, hint } = props;
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

      <div className="flex items-center justify-end w-full">
        <Switch.Root
          className="relative h-5 w-8 cursor-pointer rounded-full bg-primary-200 outline-none data-[state=checked]:bg-primary-500 border border-default"
          id={id}
          checked={checked}
          onCheckedChange={onChange}
        >
          <Switch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-surface border border-default transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-3" />
        </Switch.Root>
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
