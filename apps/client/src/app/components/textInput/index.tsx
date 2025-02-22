import { Field, Input, Label } from '@headlessui/react';

interface ICWTextInput {
  id: string;
  label: string;
  defaultValue: string;
  onChange: (e: any) => void;
}

function CWTextInput(props: ICWTextInput) {
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
          className="text-primary-text border border-primary-border py-2 pl-3 pr-8 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
        />
      </div>
    </Field>
  );
}

export default CWTextInput;
