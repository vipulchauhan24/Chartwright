import { CWGhostLink } from '@chartwright/core-components';
import ProfileDropdown from '../../components/profileDropdown';

function AppHeader() {
  return (
    <header className="h-[4.5rem] border-b border-border py-2 px-4 flex items-center justify-between">
      <CWGhostLink
        href="/"
        label={<img src="/cw-logo.png" alt="chart wright" className="h-12" />}
      />
      <div>
        <ProfileDropdown />
      </div>
    </header>
  );
}

export default AppHeader;
