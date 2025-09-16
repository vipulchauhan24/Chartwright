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
          ? 'hover:text-body pointer-events-none select-none text-primary bg-surface flex items-center gap-2'
          : 'transition duration-200 ease-in-out border rounded-md text-body border-default hover:btn-primary-hover hover:text-background hover:border-primary'
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
