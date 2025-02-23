import CWLink from '../../components/link';

function AppHeader() {
  return (
    <header className="h-[4.5rem] border-b border-primary-border py-2 px-4">
      <CWLink
        href="/"
        nohover
        label={<img src="/cw-logo.png" alt="chart wright" className="h-12" />}
      />
    </header>
  );
}

export default AppHeader;
