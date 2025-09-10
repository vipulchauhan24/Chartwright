import clsx from 'clsx';
import React, { forwardRef } from 'react';

interface ICWOutlineButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: boolean;
}

export const CWOutlineButton = forwardRef<HTMLButtonElement, ICWOutlineButton>(
  ({ label, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled}
        className={clsx(
          disabled &&
            'btn-disabled btn-disabled-border pointer-events-none select-none',
          'transition duration-200 ease-in-out border rounded-md text-body border-default hover:btn-primary-hover hover:text-surface hover:border-primary-600 py-1 px-3 cursor-pointer'
        )}
      >
        {label}
      </button>
    );
  }
);
