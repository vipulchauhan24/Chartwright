import { Link } from 'react-router-dom';

interface ICWLinkButton {
  href: string;
  label: string;
}

function CWLinkButton(props: ICWLinkButton) {
  const { href, label } = props;
  return (
    <Link
      to={href}
      className="rounded-lg relative py-2 px-3 transition duration-200 ease-in-out text-primary-background hover:text-primary-text border border-primary-main hover:border-primary-border  bg-primary-main hover:bg-primary-background"
    >
      {label}
    </Link>
  );
}

export default CWLinkButton;
