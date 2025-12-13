import React, { useCallback } from 'react';
import { DropdownMenu, Avatar } from 'radix-ui';
import useAuthentication from '../../charteditor/hooks/useAuthentication';
import { CWSGhostIconButton, CWSolidButton } from '@chartwright/ui-components';
import { LogOut, User } from 'lucide-react';

const { VITE_CLIENT_ID } = import.meta.env;

function UserProfile() {
  const { isAuthenticated, initials, signinRedirect, signoutRedirect } =
    useAuthentication();

  const redirectToLoginPage = useCallback(() => {
    signinRedirect();
  }, [signinRedirect]);

  const logout = useCallback(async () => {
    await signoutRedirect({
      extraQueryParams: {
        client_id: VITE_CLIENT_ID,
        logout_uri: window.location.origin,
      },
    });
  }, [signoutRedirect]);

  if (!isAuthenticated) {
    return <CWSolidButton label="Sign in" onClick={redirectToLoginPage} />;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root className="size-10 bg-transparent border border-primary-500 cursor-pointer rounded-full">
          <Avatar.Fallback className="leading-1 flex rounded-full size-full items-center justify-center bg-transparent border border-primary-500 text-base font-extrabold text-primary-500">
            {initials || <User className="size-4" aria-hidden={true} />}
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="surface shadow-popover rounded-md py-2 px-1"
          align="end"
        >
          <DropdownMenu.Item className="px-2">
            <CWSGhostIconButton
              icon={<LogOut className="size-4" aria-hidden={true} />}
              label="Sign out"
              onClick={logout}
            />
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-surface" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default React.memo(UserProfile);
