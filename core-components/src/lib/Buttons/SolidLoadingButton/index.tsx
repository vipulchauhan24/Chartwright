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
          'btn-disabled btn-disabled-border pointer-events-none select-none',
        'transition duration-200 ease-in-out py-1 px-3 border rounded-md relative',
        'border-primary-600 bg-primary-600 hover:bg-surface text-surface hover:text-primary-600 hover:border-primary-600 flex items-center gap-2 cursor-pointer'
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
