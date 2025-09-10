import { CWGhostLink } from '@chartwright/core-components';
import UserProfile from '../../components/userProfile';

function AppHeader() {
  return (
    <header className="h-[4.5rem] border-b border-default py-2 px-4 flex items-center justify-between">
      <CWGhostLink
        href="/"
        label={
          <span
            className="bg-[url('/logo.webp')] h-12 w-52 bg-center bg-no-repeat bg-cover"
            role="img"
            aria-label="chart wright"
          />
        }
      />
      <UserProfile />
    </header>
  );
}

export default AppHeader;
