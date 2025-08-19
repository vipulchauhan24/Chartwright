import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface ICWGhostIconButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  iconLeft?: boolean;
  disabled?: boolean;
}

export const CWSGhostIconButton = forwardRef<
  HTMLButtonElement,
  ICWGhostIconButton
>(({ disabled, label, icon, iconLeft, ...props }, ref) => {
  return (
    <button
      disabled={disabled}
      ref={ref}
      {...props}
      className={clsx(
        disabled &&
          'opacity-50 hover:text-text-main pointer-events-none select-none',
        'transition duration-200 ease-in-out py-1 px-3 text-text-main hover:text-primary flex items-center gap-2'
      )}
    >
      {iconLeft && <span>{icon}</span>}
      {label}
      {!iconLeft && <span>{icon}</span>}
    </button>
  );
});
