import clsx from 'clsx';
import React, { forwardRef, useCallback } from 'react';
import { CWSpinner } from '../../Spinner';
import Tippy from '@tippyjs/react';

interface ICWOutlineButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string | React.ReactNode;
  isLoading?: boolean;
  loadingLabel?: string | React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
}

export const CWOutlineButton = forwardRef<HTMLButtonElement, ICWOutlineButton>(
  (
    {
      label,
      disabled,
      isLoading,
      loadingLabel,
      iconLeft,
      iconRight,
      tooltip,
      ...props
    },
    ref
  ) => {
    const buttonJSX = useCallback(() => {
      return (
        <button
          ref={ref}
          {...props}
          disabled={disabled}
          className={clsx(
            isLoading || disabled
              ? 'btn-disabled btn-disabled-border pointer-events-none select-none'
              : 'text-body cursor-pointer',
            'transition duration-200 ease-in-out border rounded-md border-default hover:btn-primary-hover hover:text-surface hover:border-primary-600 py-1 flex items-center gap-2',
            loadingLabel || label ? 'px-3' : 'px-2'
          )}
        >
          {iconLeft && <span>{isLoading ? <CWSpinner /> : iconLeft}</span>}
          {isLoading ? loadingLabel : label}
          {iconRight && <span>{isLoading ? <CWSpinner /> : iconRight}</span>}
        </button>
      );
    }, [
      disabled,
      iconLeft,
      iconRight,
      isLoading,
      label,
      loadingLabel,
      props,
      ref,
    ]);

    if (tooltip) {
      return <Tippy content={tooltip}>{buttonJSX()}</Tippy>;
    } else {
      return <>{buttonJSX()}</>;
    }
  }
);
