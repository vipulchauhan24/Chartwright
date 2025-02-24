import { Button } from '@headlessui/react';
import clsx from 'clsx';

interface ICWButton {
  label: string | React.ReactNode;
  onClick: (e: any) => void;
  additionalCssClasses?: string;
}

function CWButton(props: ICWButton) {
  const { label, onClick, additionalCssClasses } = props;

  return (
    <Button
      onClick={onClick}
      className={clsx(
        additionalCssClasses,
        'transition duration-200 ease-in-out text-primary-text py-2 px-3 border border-primary-border rounded-lg relative hover:bg-primary-main hover:text-primary-background hover:border-primary-main'
      )}
    >
      {label}
    </Button>
  );
}

export default CWButton;
