import { Select } from 'radix-ui';
import { ChevronDown, Check, ChevronUp, Info } from 'lucide-react';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';

interface ICWSelect {
  id: string;
  label?: string;
  placeholder: string;
  items: Array<{ id: string | number; value: string; label: string }>;
  onChange: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  hint?: string;
}

export function CWSelect({
  id,
  placeholder,
  items,
  defaultValue,
  onChange,
  disabled,
  label,
  hint,
}: ICWSelect) {
  return (
    <div
      className={clsx('flex items-center justify-between', label && 'gap-2')}
    >
      {label && (
        <div className="min-w-[40%] max-w-[40%]">
          <label
            htmlFor={id}
            title={label}
            className="text-base font-normal text-body select-none"
          >
            {label}
          </label>
        </div>
      )}
      <div className="flex items-center justify-start  w-full">
        <Select.Root
          defaultValue={defaultValue}
          onValueChange={onChange}
          disabled={disabled}
        >
          <Select.Trigger
            className="flex border border-default rounded-md py-1 px-2 w-full cursor-pointer"
            id={id}
          >
            <div className="w-20 truncate text-left">
              <Select.Value placeholder={placeholder} />
            </div>
            <Select.Icon className="text-body flex items-center justify-end ml-auto">
              <ChevronDown className="size-4" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-50 bg-surface rounded-md shadow-popover border border-default">
              <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-surface text-primary rounded-md">
                <ChevronUp className="size-4" />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                <Select.Group>
                  {items.map((item) => {
                    return (
                      <Select.Item
                        id={`${item.id}`}
                        key={item.id}
                        value={item.value}
                        className="flex items-center justify-between px-2 py-1 rounded-md cursor-pointer data-[highlighted]:bg-primary-500  data-[highlighted]:text-surface"
                      >
                        <Select.ItemText className="truncate">
                          {item.label}
                        </Select.ItemText>
                        <Select.ItemIndicator className="ml-1">
                          <Check className="size-4" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    );
                  })}
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-surface text-primary rounded-md">
                <ChevronDown className="size-4" />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {hint && (
          <Tippy content={hint}>
            <Info
              className="min-w-4 min-h-4 size-4 opacity-80 ml-2"
              aria-hidden={true}
            />
          </Tippy>
        )}
      </div>
    </div>
  );
}
