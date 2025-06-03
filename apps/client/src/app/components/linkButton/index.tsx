import { Link } from 'react-router-dom';

interface ICWLinkButton {
  href: string;
  label: string | React.ReactNode;
}

function CWLinkButton(props: ICWLinkButton) {
  const { href, label } = props;
  return (
    <Link
      to={href}
      className="rounded-lg relative py-2 px-3 transition duration-200 ease-in-out text-background hover:text-text-main border border-primary hover:border-border  bg-primary hover:bg-background flex items-center gap-1"
    >
      {label}
    </Link>
  );
}

export default CWLinkButton;
