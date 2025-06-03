import { Button } from '@headlessui/react';
import { X } from 'lucide-react';

interface ICWChip {
  label: string;
  onDelete: (event: any) => void;
}

function CWChip(props: ICWChip) {
  const { label, onDelete } = props;

  return (
    <div className="border border-border rounded-full w-fit py-1 px-2 flex items-center justify-between gap-2">
      <span>{label}</span>
      <Button
        onClick={onDelete}
        className="transition duration-200 ease-in-out text-text-main border border-border rounded-lg relative hover:bg-primary hover:text-background hover:border-primary"
      >
        <X className="size-4" aria-hidden={true} />
      </Button>
    </div>
  );
}

export default CWChip;
