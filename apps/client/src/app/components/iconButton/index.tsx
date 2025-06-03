import { Button } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import React from 'react';

interface IIconButton {
  icon: React.ReactNode;
  onClick: (e: any) => void;
  tooltip?: string;
}

function IconButton(props: IIconButton) {
  const { icon, onClick, tooltip } = props;

  const buttonJSX = () => {
    return (
      <Button
        onClick={onClick}
        className="bg-background p-1 hover:bg-primary hover:text-background rounded-sm"
      >
        {icon}
      </Button>
    );
  };

  if (tooltip) {
    return <Tippy content={tooltip}>{buttonJSX()}</Tippy>;
  } else {
    return <>{buttonJSX()}</>;
  }
}

export default IconButton;
