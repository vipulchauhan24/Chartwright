import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface ICWGhostButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | React.ReactNode;
  disabled?: boolean;
}
export const CWGhostButton = forwardRef<HTMLButtonElement, ICWGhostButton>(
  ({ disabled, label, ...props }, ref) => {
    return (
      <button
        disabled={disabled}
        ref={ref}
        {...props}
        className={clsx(
          disabled && '!btn-disabled pointer-events-none select-none',
          'transition duration-200 ease-in-out py-1 px-3 text-body hover:text-primary-500 cursor-pointer'
        )}
      >
        {label}
      </button>
    );
  }
);
