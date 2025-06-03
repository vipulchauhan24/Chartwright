import { Field, Label, Textarea } from '@headlessui/react';
import clsx from 'clsx';
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
    <Field
      className={clsx('flex items-center justify-between', label && 'gap-2')}
    >
      {label && (
        <Label
          htmlFor={id}
          className="text-base font-normal text-text-main select-none"
        >
          {label}
        </Label>
      )}
      <Textarea
        id={id}
        value={value.current}
        onChange={update}
        className="text-text-main border w-full border-border py-2 pl-3 rounded-lg focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 appearance-none"
        rows={3}
      />
    </Field>
  );
}

export default CWTextArea;
