import { Select } from 'radix-ui';
import { ChevronDown, Check, ChevronUp } from 'lucide-react';

interface ICWSelect {
  placeholder: string;
  items: Array<{ id: string | number; value: string; label: string }>;
  onChange: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

export function CWSelect({
  placeholder,
  items,
  defaultValue,
  onChange,
  disabled,
}: ICWSelect) {
  return (
    <Select.Root
      defaultValue={defaultValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <Select.Trigger className="flex border border-border rounded-md py-1 px-2 w-28">
        <div className="w-20 truncate text-left">
          <Select.Value placeholder={placeholder} className="" />
        </div>
        <Select.Icon className="text-text-main flex items-center justify-end ml-auto">
          <ChevronDown className="size-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 bg-white rounded-md shadow-lg border border-border">
          <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-primary rounded-md">
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
                    className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer data-[highlighted]:bg-primary  data-[highlighted]:text-white"
                  >
                    <Select.ItemText className="truncate">
                      {item.label}
                    </Select.ItemText>
                    <Select.ItemIndicator className="ml-1">
                      <Check className="size-4 text-primary" />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-primary rounded-md">
            <ChevronDown className="size-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
