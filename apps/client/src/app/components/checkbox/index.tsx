import { Checkbox, Field, Label } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface ICWCheckbox {
  id: string;
  label: string;
  onChange: (e: any) => void;
  checked: boolean;
}

function CWCheckbox(props: ICWCheckbox) {
  const { id, label, onChange, checked } = props;

  return (
    <Field className="flex items-center justify-between">
      <Label
        htmlFor={id}
        className="text-base font-normal text-primary-text select-none"
      >
        {label}
      </Label>
      <Checkbox
        id={id}
        checked={checked}
        onChange={onChange}
        className="group cursor-pointer size-6 rounded-md bg-white/10 p-1 ring-1 ring-primary-border data-[checked]:ring-primary-main ring-inset data-[checked]:bg-primary-main"
      >
        <CheckIcon className="hidden size-4 stroke-primary-background group-data-[checked]:block" />
      </Checkbox>
    </Field>
  );
}

export default CWCheckbox;
