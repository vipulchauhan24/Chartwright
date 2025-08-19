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
          disabled &&
            'opacity-50 hover:text-text-main pointer-events-none select-none',
          'transition duration-200 ease-in-out py-1 px-3 border rounded-lg relative',
          'text-white border-primary bg-primary hover:bg-white hover:text-primary'
        )}
      >
        {label}
      </button>
    );
  }
);
