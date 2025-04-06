import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import IconButton from '../iconButton';
import { X } from 'lucide-react';

interface ICWModal {
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

function CWModal(props: ICWModal) {
  const { title, isOpen, setIsOpen, children } = props;

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-[999] focus:outline-none"
      onClose={toggleOpen}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="rounded-xl bg-white border border-primary-border p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="flex items-center justify-between">
              <DialogTitle
                as="h3"
                className="text-2xl font-semibold text-primary-text"
              >
                {title}
              </DialogTitle>
              <IconButton
                icon={<X className="size-4" aria-hidden={true} />}
                onClick={toggleOpen}
                tooltip="Close"
              />
            </div>

            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default CWModal;
