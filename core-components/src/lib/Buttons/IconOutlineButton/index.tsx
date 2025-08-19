import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import React, { forwardRef, useCallback } from 'react';

interface ICWIconOutlineButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
}

export const CWIconOutlineButton = forwardRef<
  HTMLButtonElement,
  ICWIconOutlineButton
>(({ icon, tooltip, disabled, ...props }, ref) => {
  const buttonJSX = useCallback(() => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled}
        className={clsx(
          disabled &&
            'opacity-50 hover:text-text-main pointer-events-none select-none',
          'transition duration-200 ease-in-out border rounded-lg text-text-main border-border hover:bg-primary hover:text-background hover:border-primary py-2 px-3'
        )}
      >
        {icon}
      </button>
    );
  }, [disabled, icon, props, ref]);

  if (tooltip) {
    return <Tippy content={tooltip}>{buttonJSX()}</Tippy>;
  } else {
    return <>{buttonJSX()}</>;
  }
});
