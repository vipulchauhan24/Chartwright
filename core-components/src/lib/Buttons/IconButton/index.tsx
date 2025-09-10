import React, { forwardRef, useCallback } from 'react';
import Tippy from '@tippyjs/react';

interface ICWIconButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
}

export const CWIconButton = forwardRef<HTMLButtonElement, ICWIconButton>(
  ({ icon, tooltip, ...props }, ref) => {
    const buttonJSX = useCallback(() => {
      return (
        <button
          ref={ref}
          {...props}
          className="bg-surface p-1 hover:btn-primary-hover hover:text-surface rounded-sm cursor-pointer"
        >
          {icon}
        </button>
      );
    }, [icon, props, ref]);

    if (tooltip) {
      return <Tippy content={tooltip}>{buttonJSX()}</Tippy>;
    } else {
      return <>{buttonJSX()}</>;
    }
  }
);
