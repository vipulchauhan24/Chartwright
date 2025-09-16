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
          disabled && 'btn-disabled pointer-events-none select-none',
          'transition duration-200 ease-in-out border rounded-md text-body border-default hover:btn-primary-hover hover:text-surface hover:border-primary-600 py-1 px-2 cursor-pointer'
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
