import React, { forwardRef } from 'react';
import { CWSpinner } from '../../Spinner';
import clsx from 'clsx';

interface ICWSolidLoadingButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading: boolean;
  loadingLabel: string;
  disabled?: boolean;
}

export const CWSolidLoadingButton = forwardRef<
  HTMLButtonElement,
  ICWSolidLoadingButton
>(({ loading, label, loadingLabel, disabled, ...props }, ref) => {
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
      {loading ? loadingLabel : label}
      {loading && (
        <span>
          <CWSpinner solid />
        </span>
      )}
    </button>
  );
});
