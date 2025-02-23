import { Button, Field, Input, Label } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

interface ICWNumberInput {
  id: string;
  label: string;
  defaultValue: number;
  onChange: (e: any) => void;
}

function CWNumberInput(props: ICWNumberInput) {
  const { id, label, defaultValue, onChange } = props;
  return (
    <Field className="flex items-center justify-between">
      <Label
        htmlFor={id}
        className="text-base font-normal text-primary-text select-none"
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          value={defaultValue}
          onChange={onChange}
          className="text-primary-text border border-primary-border py-2 pl-3 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
        />
        <Button className="absolute top-2/4 -translate-y-2/4 right-9 bg-primary-background p-1 hover:bg-primary-main hover:text-primary-background rounded-sm">
          <MinusIcon className="size-4" aria-hidden={true} />
        </Button>
        <Button className="absolute top-2/4 -translate-y-2/4 right-2 bg-primary-background p-1 hover:bg-primary-main hover:text-primary-background rounded-sm">
          <PlusIcon className="size-4" aria-hidden={true} />
        </Button>
      </div>
    </Field>
  );
}

export default CWNumberInput;
