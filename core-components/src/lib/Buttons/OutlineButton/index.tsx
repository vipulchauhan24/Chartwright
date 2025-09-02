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
            'opacity-50 hover:text-text-main pointer-events-none select-none',
          'transition duration-200 ease-in-out border rounded-lg text-text-main border-border hover:bg-primary hover:text-background hover:border-primary py-1 px-3'
        )}
      >
        {label}
      </button>
    );
  }
);
