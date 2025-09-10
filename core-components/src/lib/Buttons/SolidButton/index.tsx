import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface ICWSolidButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: boolean;
}

export const CWSolidButton = forwardRef<HTMLButtonElement, ICWSolidButton>(
  ({ disabled, label, ...props }, ref) => {
    return (
      <button
        disabled={disabled}
        ref={ref}
        {...props}
        className={clsx(
          disabled && 'btn-disabled pointer-events-none select-none',
          'transition duration-200 ease-in-out py-1 px-3 border rounded-md relative cursor-pointer',
          'text-surface border-primary-600 bg-primary-600 hover:bg-transparent hover:text-primary-600 hover:border-primary-600'
        )}
      >
        {label}
      </button>
    );
  }
);
