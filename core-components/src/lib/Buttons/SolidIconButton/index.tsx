import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface ICWSolidIconButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export const CWSolidIconButton = forwardRef<
  HTMLButtonElement,
  ICWSolidIconButton
>(({ disabled, label, icon, ...props }, ref) => {
  return (
    <button
      disabled={disabled}
      ref={ref}
      {...props}
      className={clsx(
        disabled &&
          'opacity-50 hover:text-text-main pointer-events-none select-none',
        'transition duration-200 ease-in-out py-1 px-3 border rounded-lg relative',
        'text-white border-primary bg-primary hover:bg-white hover:text-primary flex items-center gap-2'
      )}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
});
