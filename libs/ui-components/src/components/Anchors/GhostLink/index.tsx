import React from 'react';
import { Link } from 'react-router-dom';

interface ICWGhostLink {
  href: string;
  label: string | React.ReactNode;
  newTab?: boolean;
}

export function CWGhostLink(props: ICWGhostLink) {
  const { href, label, newTab } = props;
  return (
    <Link
      to={href}
      target={newTab ? '_blank' : '_self'}
      className="text-body transition duration-200 ease-in-out flex items-center gap-1 hover:text-primary-500 cursor-pointer"
    >
      {label}
    </Link>
  );
}
