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
        <CWIconButton tooltip={title} icon={icon} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-white pt-2 rounded-lg drop-shadow-xl z-50"
          side={side || 'right'}
          sideOffset={5}
          align="center"
        >
          <div className="w-full flex justify-end p-2">
            <Tippy content="Close">
              <Popover.Close
                aria-label="Close"
                className="bg-background p-1 hover:bg-primary hover:text-background rounded-sm"
              >
                <X className="size-4" aria-hidden={true} />
              </Popover.Close>
            </Tippy>
          </div>
          <div className="px-4 py-2">{content}</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
