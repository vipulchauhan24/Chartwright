import React, { forwardRef, useCallback } from 'react';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';

interface ICWIconButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
}

export const CWIconButton = forwardRef<HTMLButtonElement, ICWIconButton>(
  ({ icon, tooltip, disabled, ...props }, ref) => {
    const buttonJSX = useCallback(() => {
      return (
        <button
          ref={ref}
          {...props}
          className={clsx(
            disabled && '!btn-disabled pointer-events-none select-none',
            'bg-bg p-1 hover:btn-primary-hover hover:text-surface rounded-sm cursor-pointer'
          )}
        >
          {icon}
        </button>
      );
    }, [icon, props, ref, disabled]);

    if (tooltip) {
      return <Tippy content={tooltip}>{buttonJSX()}</Tippy>;
    } else {
      return <>{buttonJSX()}</>;
    }
  }
);
