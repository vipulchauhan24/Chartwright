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
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none z-50">
          <Dialog.Title className="text-2xl font-bold text-text-main">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm mb-2 font-normal text-text-main">
            {description}
          </Dialog.Description>
          <div>{content}</div>
          <Dialog.Close asChild>
            <div className="absolute right-2.5 top-2.5">
              <CWIconButton
                icon={<X className="size-6" aria-hidden={true} />}
              />
            </div>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
