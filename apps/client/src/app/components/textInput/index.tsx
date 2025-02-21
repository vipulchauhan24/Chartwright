import { Field, Input, Label } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

function CWTextInput() {
  return (
    <Field>
      <div className="flex items-center justify-start gap-1">
        <Label className="text-md font-medium text-primary-text">Name</Label>
        <InformationCircleIcon className="w-5 h-5" />
      </div>
      <Input className="mt-3 block w-full rounded-lg border border-primary-border py-1.5 px-3 text-sm/6 text-primary-text focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25" />
    </Field>
  );
}

export default CWTextInput;
