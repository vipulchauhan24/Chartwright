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
        'text-primary-text transition duration-200 ease-in-out',
        !nohover &&
          'hover:border-b-primary-border hover:border-b hover:text-primary-main'
      )}
    >
      {label}
    </Link>
  );
}

export default CWLink;
