import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface ICWLink {
  href: string;
  label: string | React.ReactNode;
  nohover?: boolean;
}

function CWLink(props: ICWLink) {
  const { href, label, nohover } = props;
  return (
    <Link
      to={href}
      className={clsx(
        'text-text-main transition duration-200 ease-in-out flex items-center gap-1',
        !nohover && 'hover:border-b-border hover:border-b hover:text-primary'
      )}
    >
      {label}
    </Link>
  );
}

export default CWLink;
