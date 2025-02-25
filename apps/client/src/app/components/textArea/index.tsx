import { Field, Label, Textarea } from '@headlessui/react';
import { useRef } from 'react';

interface ICWTextArea {
  id: string;
  label?: string;
  defaultValue: string;
  onChange: (e: any) => void;
}
function CWTextArea(props: ICWTextArea) {
  const { id, label, defaultValue, onChange } = props;
  const value = useRef(defaultValue);

  const update = (e: any) => {
    value.current = e.target.value;
    onChange(e);
  };
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
        value={value.current}
        onChange={update}
        className="text-primary-text border w-full border-primary-border py-2 pl-3 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 appearance-none"
        rows={3}
      />
    </Field>
  );
}

export default CWTextArea;
