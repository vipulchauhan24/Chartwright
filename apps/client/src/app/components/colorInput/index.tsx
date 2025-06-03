import { Field, Input, Label } from '@headlessui/react';

interface ICWColorInput {
  id: string;
  label: string;
  defaultValue: string;
  onChange: (e: any) => void;
}

function CWColorInput(props: ICWColorInput) {
  const { id, label, defaultValue, onChange } = props;

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-between gap-1">
          <Label
            htmlFor={id}
            className="text-base font-normal text-text-main select-none"
          >
            {label}
          </Label>
        </div>
        <Input
          id={id}
          type="color"
          value={defaultValue}
          onChange={onChange}
          className="text-text-main border border-border px-2 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none"
        />
      </div>
    </Field>
  );
}

export default CWColorInput;
