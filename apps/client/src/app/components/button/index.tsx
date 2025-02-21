import { Button } from '@headlessui/react';

interface ICWButton {
  label: string | React.ReactNode;
}

function CWButton(props: ICWButton) {
  const { label } = props;

  return (
    <Button className="transition duration-200 ease-in-out text-primary-text py-2 px-3 border border-primary-border rounded-lg relative hover:bg-primary-main hover:text-primary-background hover:border-primary-main">
      {label}
    </Button>
  );
}

export default CWButton;
