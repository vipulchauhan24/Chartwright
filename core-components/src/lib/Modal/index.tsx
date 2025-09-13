import React from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import { CWIconButton } from '../Buttons/IconButton';

interface ICWModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  content: React.ReactNode;
}

export function CWModal({
  open,
  setOpen,
  title,
  description,
  content,
}: ICWModal) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md surface py-4 px-6 shadow-popover focus:outline-none z-50">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-2xl font-bold text-body">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild aria-label="close">
              <CWIconButton
                icon={<X className="size-5" aria-hidden={true} />}
              />
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-sm mb-2 font-normal text-body">
            {description}
          </Dialog.Description>
          <div>{content}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
