import React from 'react';
import { Link } from 'react-router-dom';

interface ICWGhostLink {
  href: string;
  label: string | React.ReactNode;
}

export function CWGhostLink(props: ICWGhostLink) {
  const { href, label } = props;
  return (
    <Link
      to={href}
      className="text-text-main transition duration-200 ease-in-out flex items-center gap-1 hover:text-primary"
    >
      {label}
    </Link>
  );
}
