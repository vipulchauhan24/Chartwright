import { Button } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ICWChip {
  label: string;
  onDelete: (event: any) => void;
}

function CWChip(props: ICWChip) {
  const { label, onDelete } = props;

  return (
    <div className="border border-primary-border rounded-full w-fit py-1 px-2 flex items-center justify-between gap-2">
      <span>{label}</span>
      <Button
        onClick={onDelete}
        className="transition duration-200 ease-in-out text-primary-text border border-primary-border rounded-lg relative hover:bg-primary-main hover:text-primary-background hover:border-primary-main"
      >
        <XMarkIcon className="size-4" />
      </Button>
    </div>
  );
}

export default CWChip;
