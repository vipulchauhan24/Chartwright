import { Button } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';

interface ICWButton {
  label: string | React.ReactNode;
  onClick: (e: any) => void;
  additionalCssClasses?: string;
  primary?: boolean;
  disabled?: boolean;
  tertiary?: boolean;
  tooltip?: string;
}

function CWButton(props: ICWButton) {
  const {
    label,
    onClick,
    additionalCssClasses,
    primary,
    disabled,
    tertiary,
    tooltip,
  } = props;

  const buttonJSX = () => {
    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          disabled && 'pointer-events-none opacity-50',
          additionalCssClasses,
          'transition duration-200 ease-in-out py-1 px-3 border rounded-lg relative flex items-center gap-2',
          primary
            ? 'text-white border-primary bg-primary hover:bg-white hover:text-primary'
            : tertiary
            ? '!p-0 text-text-main border-0 hover:text-primary'
            : 'text-text-main border-border hover:bg-primary hover:text-background hover:border-primary'
        )}
      >
        {label}
      </Button>
    );
  };

  if (tooltip) {
    return (
      <Tippy content={tooltip}>
        <span>{buttonJSX()}</span>
      </Tippy>
    );
  } else {
    return <>{buttonJSX()}</>;
  }
}

export default CWButton;
