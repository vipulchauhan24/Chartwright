import React, { forwardRef } from 'react';
import { CWSpinner } from '../../Spinner';
import clsx from 'clsx';

interface ICWOutlineLoadingButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading: boolean;
  loadingLabel: string;
}

export const CWOutlineLoadingButton = forwardRef<
  HTMLButtonElement,
  ICWOutlineLoadingButton
>(({ loading, label, loadingLabel, ...props }, ref) => {
  return (
    <button
      disabled={loading}
      ref={ref}
      {...props}
      className={clsx(
        'py-1 px-3',
        loading
          ? 'hover:text-text-main pointer-events-none select-none text-primary bg-white flex items-center gap-2'
          : 'transition duration-200 ease-in-out border rounded-lg text-text-main border-border hover:bg-primary hover:text-background hover:border-primary'
      )}
    >
      {loading ? loadingLabel : label}
      {loading && (
        <span>
          <CWSpinner />
        </span>
      )}
    </button>
  );
});
