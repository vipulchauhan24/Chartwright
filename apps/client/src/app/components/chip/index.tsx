import { XMarkIcon } from '@heroicons/react/20/solid';
import { Button } from '@headlessui/react';

interface ICWChip {
  label: string;
}

function CWChip(props: ICWChip) {
  const { label } = props;
  return (
    <div className="border border-primary-border rounded-full w-fit py-1 px-2 flex items-center justify-between gap-2">
      <span>{label}</span>
      <Button className="transition duration-200 ease-in-out text-primary-text border border-primary-border rounded-lg relative hover:bg-primary-main hover:text-primary-background hover:border-primary-main">
        <XMarkIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default CWChip;
