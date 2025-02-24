import { Field, Label, Textarea } from '@headlessui/react';

interface ICWTextArea {
  id: string;
  label?: string;
  defaultValue: string;
  onChange: (e: any) => void;
}
function CWTextArea(props: ICWTextArea) {
  const { id, label, defaultValue, onChange } = props;
  return (
    <Field className="flex items-center justify-between gap-2">
      {label && (
        <Label
          htmlFor={id}
          className="text-base font-normal text-primary-text select-none"
        >
          {label}
        </Label>
      )}
      <Textarea
        id={id}
        value={defaultValue}
        onChange={onChange}
        className="text-primary-text border w-full border-primary-border py-2 pl-3 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
        rows={3}
      />
    </Field>
  );
}

export default CWTextArea;
