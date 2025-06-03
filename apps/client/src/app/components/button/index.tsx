import { Button } from '@headlessui/react';
import clsx from 'clsx';

interface ICWButton {
  label: string | React.ReactNode;
  onClick: (e: any) => void;
  additionalCssClasses?: string;
  primary?: boolean;
  disabled?: boolean;
}

function CWButton(props: ICWButton) {
  const { label, onClick, additionalCssClasses, primary, disabled } = props;

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        disabled && 'pointer-events-none opacity-50',
        additionalCssClasses,
        'transition duration-200 ease-in-out py-2 px-3 border rounded-lg relative flex items-center gap-2',
        primary
          ? 'text-white border-primary bg-primary hover:bg-white hover:text-primary'
          : 'text-text-main border-border hover:bg-primary hover:text-background hover:border-primary'
      )}
    >
      {label}
    </Button>
  );
}

export default CWButton;
