import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface ICWSolidIconButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
}

export const CWSolidIconButton = forwardRef<
  HTMLButtonElement,
  ICWSolidIconButton
>(({ disabled, label, iconLeft, iconRight, ...props }, ref) => {
  return (
    <button
      disabled={disabled}
      ref={ref}
      {...props}
      className={clsx(
        disabled && 'btn-disabled pointer-events-none select-none',
        'transition duration-200 ease-in-out py-1 px-3 border rounded-md relative cursor-pointer flex items-center gap-2',
        'text-surface border-primary-600 bg-primary-600 hover:bg-transparent hover:text-primary-600 hover:border-primary-600'
      )}
    >
      {iconLeft && <span>{iconLeft}</span>}
      {label}
      {iconRight && <span>{iconRight}</span>}
    </button>
  );
});
