import React from 'react';
import { Popover } from 'radix-ui';
import { X } from 'lucide-react';
import { CWIconButton } from '../Buttons/IconButton';
import Tippy from '@tippyjs/react';

interface ICWPopover {
  content: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function CWPopover(props: ICWPopover) {
  const { content, title, icon, side } = props;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <CWIconButton tooltip={title} icon={icon} aria-label={title} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-surface pb-2 rounded-md shadow-popover z-50 max-w-72"
          side={side || 'right'}
          sideOffset={5}
          align="center"
        >
          <div className="w-full flex justify-end p-2">
            <Popover.Close
              aria-label="Close"
              className="bg-app p-1 hover:btn-primary-hover hover:text-surface rounded-sm cursor-pointer"
            >
              <X className="size-4" aria-hidden={true} />
            </Popover.Close>
          </div>
          <div className="px-4 py-2">{content}</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
