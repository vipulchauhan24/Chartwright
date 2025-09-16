import React from 'react';
import { Link } from 'react-router-dom';

interface ICWSolidLink {
  href: string;
  label: string | React.ReactNode;
}

export function CWSolidLink(props: ICWSolidLink) {
  const { href, label } = props;
  return (
    <Link
      to={href}
      className="rounded-md relative py-1 px-3 transition duration-200 ease-in-out text-background hover:text-body border border-primary hover:border-default  bg-primary hover:bg-app flex items-center gap-1"
    >
      {label}
    </Link>
  );
}
